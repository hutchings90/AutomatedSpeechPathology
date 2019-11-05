Vue.component('new-recording', {
	props: [ 'active', 'gettingTextSamples', 'processingNewRecording', 'textSamples', 'mediaDevices' ],
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
			<div v-show='audioSrc'>
				<audio ref='newRecording' :src='audioSrc' controls></audio>
			</div>
		</div>
	</div>`,
	created: function() {
		this.initMediaDevices();
		this.nextTextSample();
	},
	data: function() {
		return {
			audioContext: null,
			analyserContext: null,
			analyserNode: null,
			spacing: 3,
			barWidth: 1,
			freqByteData: null,
			activeTextSample: null,
			audioVisualizerInterval: null,
			listening: false,
			audioSrc: '',
			timeout: null,
			maxTime: 30000,
			mediaRecorder: null,
			chunks: [],
			constraints: {
				audio: true
			},
		};
	},
	computed: {
		disableTextSampleControls: function() { return this.listening || this.processingNewRecording || this.gettingTextSamples; },
		disableRecordingControls: function() { return this.gettingTextSamples; },
		canvas: function() { return this.$refs.analyser; },
		numBars: function() { return Math.round(this.canvas.width / this.spacing); },
		multiplier: function() { return this.analyserNode.frequencyBinCount / this.numBars; }
	},
	watch: {
		active: function() {
			if (this.active) this.activate();
			else this.deactivate();
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
			this.setActiveTextSample(this.textSamples.indexOf(this.activeTextSample) + 1);
		},
		prevTextSample: function() {
			this.setActiveTextSample(this.textSamples.indexOf(this.activeTextSample) - 1);
		},
		setActiveTextSample: function(i) {
			if (this.listening) return;
			if (this.textSamples.length < 1) {
				this.activeTextSample = {
					id: null,
					text: 'No text samples were found. Searching for new text samples...'
				};
				this.getNewTextSamples();
			}
			else {
				if (i >= this.textSamples.length) i = 0;
				else if (i < 0) i = this.textSamples.length - 1;
				this.activeTextSample = this.textSamples[i];
			}
		},
		getNewTextSamples: function() {
			if (this.listening) return;
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
			let blob = new Blob(this.chunks, { type: 'audio/ogg; codecs=opus' });

			this.audioSrc = URL.createObjectURL(blob);
			this.chunks = [];
			this.listening = false;
					
			this.$emit('new-recording', {
				blob: blob,
				filename: '__' + Math.floor((new Date()).getTime() / 1000) + '__.ogg',
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
			this.freqByteData = new Uint8Array(this.analyserNode.frequencyBinCount);

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
			}, );
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
		}
	}
});