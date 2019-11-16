/**
 * Recording and WAV encoding based on Matt Diamond's work at https://github.com/mattdiamond/Recorderjs.
 */
Vue.component('new-recording', {
	props: [ 'active', 'gettingTextSamples', 'processing', 'textSamples' ],
	template: `<div>
		<div v-if='showBrowserRecordingSupportError'>Failed to access audio.</div>
		<div v-else>
			<div class='viz'>
				<canvas ref='analyser' width='1024' height='500'></canvas>
			</div>
			<div class='new-recording-prompt'>
				<div>
					<button @click='prevTextSample' :disabled='disableTextSampleControls'><</button>
					<button @click='getNewTextSamples' :disabled='disableTextSampleControls'>New Phrases</button>
					<button @click='nextTextSample' :disabled='disableTextSampleControls'>></button>
					<pre v-html='activeTextSample.text' class='sample-text''></pre>
				</div>
				<button @click='beginRecording' v-show='!listening' :disabled='disableRecordingControls'>Record</button>
				<button @click='endRecording' v-show='listening' :disabled='disableRecordingControls'>Stop</button>
				<div v-show='showAudio'>
					<audio ref='newRecording' :src='audioSrc' controls></audio>
				</div>
			</div>
		</div>
	</div>`,
	mounted: function() {
		this.initMediaDevices();
		this.nextTextSample();
	},
	data: function() {
		return {
			audioContext: null,
			analyserContext: null,
			analyserNode: null,
			numBars: 100,
			freqByteData: null,
			activeTextSampleIndex: 0,
			audioVisualizerInterval: null,
			listening: false,
			audioSrc: '',
			timeout: null,
			maxTime: 14000,
			node: null,
			numChannels: 2,
			recBuffers: [[], []],
			recLength: 0,
			constraints: {
				audio: true
			},
			textSamplesGotten: true,
			failedToGetUserMedia: false
		};
	},
	computed: {
		browserSupportsRecording: function() { return navigator.mediaDevices || this.failedToGetUserMedia; },
		showBrowserRecordingSupportError: function() { return !this.browserSupportsRecording; },
		disableRecordingControls: function() { return this.processing || this.gettingTextSamples; },
		disableTextSampleControls: function() { return this.listening || this.disableRecordingControls; },
		showAudio: function() { return this.audioSrc && !this.listening; },
		canvas: function() { return this.$refs.analyser; },
		spacing: function() { return Math.round(this.canvas.width / this.numBars); },
		barWidth: function() { return Math.floor(this.spacing / 2); },
		frequencyBinCount: function() { return Math.min(this.analyserNode.frequencyBinCount, 512); },
		multiplier: function() { return this.frequencyBinCount / this.numBars; },
		activeTextSample: function() {
			if (this.textSamples.length < 1) {
				let textSample = {
					id: null,
					text: 'No text samples were found.'
				};
				if (!this.gettingTextSamples && !this.textSamplesGotten) {
					textSample.text += ' Searching for new text samples...';
					this.getNewTextSamples();
				}
				return textSample;
			}
			return this.textSamples[this.activeTextSampleIndex];
		}
	},
	watch: {
		active: function() {
			if (this.active) this.activate();
			else this.deactivate();
		},
		textSamples: function(newVal, oldVal) {
			this.textSamplesGotten = true;
		}
	},
	methods: {
		initMediaDevices: function() {
			if (navigator.getUserMedia) {
				navigator.getUserMedia(this.constraints, (stream) => {
					this.gotStream(stream);
				}, (err) => {
					alert('Unable to access audio.\n\n' + err);
					console.log('The following error occurred: ' + err);
					this.failedToGetUserMedia = true;
				});
			}
			else if (navigator.mediaDevices.getUserMedia) {
				navigator.mediaDevices.getUserMedia(this.constraints).then((stream) => {
					this.gotStream(stream);
				}).catch((err) => {
					alert('Unable to access audio.\n\n' + err);
					console.log('The following error occurred: ' + err);
					this.failedToGetUserMedia = true;
				});
			}
			else this.failedToGetUserMedia = true;
		},
		nextTextSample: function() {
			this.setActiveTextSamplePage(this.activeTextSampleIndex + 1);
		},
		prevTextSample: function() {
			this.setActiveTextSamplePage(this.activeTextSampleIndex - 1);
		},
		setActiveTextSamplePage: function(page) {
			if (page >= this.textSamples.length) page = 0;
			else if (page < 0) page = this.textSamples.length - 1;
			this.activeTextSampleIndex = page;
		},
		getNewTextSamples: function() {
			if (this.listening) return;
			this.textSamplesGotten = false;
			this.$emit('get-new-text-samples');
		},
		endRecording: function() {
			clearTimeout(this.timeout);
			this.timeout = null;
			this.newRecording();
		},
		beginRecording: function() {
			if (this.timeout) return;
			this.audioSrc = '';
			this.recBuffers = [[], []];
			this.recLength = 0;
			this.listening = true;
			this.timeout = setTimeout(() => {
				this.endRecording();
			}, this.maxTime);
		},
		newRecording: function() {
			let buffers = [];
			for (var i = 0; i < this.numChannels; i++) {
				buffers.push(this.mergeBuffers(this.recBuffers[i], this.recLength));
			}

			let interleaved = this.numChannels == 2 ? this.interleave(buffers[0], buffers[1]) : buffers[0];
			let dataView = this.encodeWAV(interleaved);
			let blob = new Blob([ dataView ], { type: 'audio/wav' });
			blob.name = Math.floor((new Date()).getTime() / 1000) + '.wav';

			this.audioSrc = URL.createObjectURL(blob);
			this.listening = false;

			this.$emit('new-recording', {
				blob: blob,
				text_sample_id: this.activeTextSample.id
			});
		},
		gotStream: function (stream) {
			this.audioContext = new AudioContext();
			this.analyserNode = this.audioContext.createAnalyser();
			this.analyserNode.fftSize = 2048;
			this.audioContext.createMediaStreamSource(stream).connect(this.analyserNode);
			this.analyserContext = this.canvas.getContext('2d');
			this.freqByteData = new Uint8Array(this.frequencyBinCount);
			if (this.active) this.startAudioVisualizer();

			this.source = this.audioContext.createMediaStreamSource(stream);
			this.context = this.source.context;
			this.node = (this.context.createScriptProcessor || this.context.createJavaScriptNode).call(this.context, 4096, this.numChannels, this.numChannels);
			this.buffers = [[], []];
			this.node.onaudioprocess = (e) => {
				if (!this.listening) return;

				for (var i = 0; i < this.numChannels; i++) {
					this.recBuffers[i].push(e.inputBuffer.getChannelData(i));
				}

				this.recLength += this.recBuffers[0][0].length;
			}
			this.source.connect(this.node);
			this.node.connect(this.context.destination);
		},
		/**
		 * Visualizer based on https://webaudiodemos.appspot.com/AudioRecorder/index.html. Retrieved Oct-Nov, 2019.
		 */
		startAudioVisualizer: function() {
			this.audioVisualizerInterval = setInterval(() => {
				this.analyserNode.getByteFrequencyData(this.freqByteData);

				this.analyserContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
				this.analyserContext.fillStyle = '#F6D565';
				this.analyserContext.lineCap = 'round';

				for (let i = 0; i < this.numBars; ++i) {
					let magnitude = 0;
					let offset = Math.floor(i * this.multiplier);

					for (let j = 0; j < this.multiplier; j++) {
						magnitude += this.freqByteData[offset + j];
					}

					magnitude = magnitude / this.multiplier;
					this.analyserContext.fillStyle = 'hsl(' + Math.round((i * 360) / this.numBars) + ', 100%, 50%)';
					this.analyserContext.fillRect(i * this.spacing, this.canvas.height, this.barWidth, -magnitude);
				}
			}, 15);
		},
		stopAudioVisualizer: function() {
			clearInterval(this.audioVisualizerInterval);
		},
		activate: function() {
			this.startAudioVisualizer();
		},
		deactivate: function() {
			this.stopAudioVisualizer();
			if (this.listening) this.endRecording();
		},
		mergeBuffers: function(buffers, len) {
			let result = new Float32Array(len);
			let offset = 0;
			for (var i = 0; i < buffers.length; i++) {
				result.set(buffers[i], offset);
				offset += buffers[i].length;
			}
			return result;
		},
		interleave: function(inputL, inputR) {
			let len = inputL.length + inputR.length;
			let result = new Float32Array(len);

			let index = 0;
			let inputIndex = 0;

			while (index < len) {
				result[index++] = inputL[inputIndex];
				result[index++] = inputR[inputIndex];
				inputIndex++;
			}

			return result;
		},
		floatTo16BitPCM: function(output, offset, input){
			for (var i = 0; i < input.length; i++, offset+=2){
				var s = Math.max(-1, Math.min(1, input[i]));
				output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
			}
		},
		writeString: function(view, offset, string){
			for (var i = 0; i < string.length; i++) {
				view.setUint8(offset + i, string.charCodeAt(i));
			}
		},
		encodeWAV: function(samples){
			var buffer = new ArrayBuffer(44 + samples.length * 2);
			var view = new DataView(buffer);

			/* RIFF identifier */
			this.writeString(view, 0, 'RIFF');
			/* file length */
			view.setUint32(4, 36 + samples.length * 2, true);
			/* RIFF type */
			this.writeString(view, 8, 'WAVE');
			/* format chunk identifier */
			this.writeString(view, 12, 'fmt ');
			/* format chunk length */
			view.setUint32(16, 16, true);
			/* sample format (raw) */
			view.setUint16(20, 1, true);
			/* channel count */
			view.setUint16(22, this.numChannels, true);
			/* sample rate */
			view.setUint32(24, this.context.sampleRate, true);
			/* byte rate (sample rate * block align) */
			view.setUint32(28, this.context.sampleRate * 4, true);
			/* block align (channel count * bytes per sample) */
			view.setUint16(32, this.numChannels * 2, true);
			/* bits per sample */
			view.setUint16(34, 16, true);
			/* data chunk identifier */
			this.writeString(view, 36, 'data');
			/* data chunk length */
			view.setUint32(40, samples.length * 2, true);

			this.floatTo16BitPCM(view, 44, samples);

			return view;
		}
	}
});