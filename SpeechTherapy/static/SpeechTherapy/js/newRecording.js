Vue.component('new-recording', {
	props: [ 'active', 'gettingTextSamples', 'processing', 'textSamples', 'mediaDevices' ],
	template: `<div>
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
			mediaRecorder: null,
			chunks: [],
			constraints: {
				audio: true
			},
			textSamplesGotten: true
		};
	},
	computed: {
		disableTextSampleControls: function() { return this.listening || this.processing || this.gettingTextSamples; },
		showAudio: function() { return this.audioSrc && !this.disableTextSampleControls; },
		disableRecordingControls: function() { return this.gettingTextSamples; },
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
		processing: function() {
			console.log('processing', this.processing);
		},
		textSamples: function(newVal, oldVal) {
			this.textSamplesGotten = true;
		}
	},
	methods: {
		initMediaDevices: function() {
			this.mediaDevices.getUserMedia(this.constraints).then((stream) => {
				this.gotStream(stream);
			}).catch((err) => {
				alert('Unable to access audio.\n\n' + err);
				console.log('The following error occurred: ' + err);
			});
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
			this.mediaRecorder.stop();
		},
		beginRecording: function() {
			if (this.timeout) return;
			this.audioSrc = '';
			this.chunks = [];
			this.mediaRecorder.start();
			this.listening = true;
			this.timeout = setTimeout(() => {
				this.endRecording();
			}, this.maxTime);
		},
		newRecording: function() {
			let blob = new Blob(this.chunks, { type: 'audio/wav; codecs=ms_pcm' });
			blob.name = Math.floor((new Date()).getTime() / 1000) + '.wav';

			this.audioSrc = URL.createObjectURL(blob);
			this.chunks = [];
			this.listening = false;
					
			this.$emit('new-recording', {
				blob: blob,
				text_sample_id: this.activeTextSample.id
			});
		},
		gotStream: function (stream) {
			let mediaRecorder = new MediaRecorder(stream);

			mediaRecorder.onstop = (e) => {
				this.newRecording();
			};

			mediaRecorder.ondataavailable = (e) => {
				this.chunks.push(e.data);
			};

			this.mediaRecorder = mediaRecorder;

			this.audioContext = new AudioContext();
			this.analyserNode = this.audioContext.createAnalyser();
			this.analyserNode.fftSize = 2048;
			this.audioContext.createMediaStreamSource(stream).connect(this.analyserNode);
			this.analyserContext = this.canvas.getContext('2d');
			this.freqByteData = new Uint8Array(this.frequencyBinCount);

			if (this.active) this.startAudioVisualizer();
		},
		startAudioVisualizer: function(time) {
			// Visualizer based on https://webaudiodemos.appspot.com/AudioRecorder/index.html. Retrieved Oct-Nov, 2019.
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
			if (this.recording) this.mediaRecorder.stop();
		},
		exportWav: function() {
			var buffer = new ArrayBuffer(44 + samples.length * 2);
			var view = new DataView(buffer);
			let offset = 44;

			/* RIFF identifier */
			writeString(view, 0, 'RIFF');
			/* file length */
			view.setUint32(4, 32 + samples.length * 2, true);
			/* RIFF type */
			writeString(view, 8, 'WAVE');
			/* format chunk identifier */
			writeString(view, 12, 'fmt ');
			/* format chunk length */
			view.setUint32(16, 16, true);
			/* sample format (raw) */
			view.setUint16(20, 1, true);
			/* channel count */
			view.setUint16(22, mono?1:2, true);
			/* sample rate */
			view.setUint32(24, sampleRate, true);
			/* byte rate (sample rate * block align) */
			view.setUint32(28, sampleRate * 4, true);
			/* block align (channel count * bytes per sample) */
			view.setUint16(32, 4, true);
			/* bits per sample */
			view.setUint16(34, 16, true);
			/* data chunk identifier */
			writeString(view, 36, 'data');
			/* data chunk length */
			view.setUint32(40, samples.length * 2, true);

			for (var i = 0; i < samples.length; i++, offset+=2){
				var s = Math.max(-1, Math.min(1, samples[i]));
				view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
			}

			return view;
		}
	}
});