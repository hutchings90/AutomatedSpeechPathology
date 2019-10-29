Vue.component('new-recording', {
	props: [ 'gettingTextSamples', 'processingNewRecording', 'textSamples' ],
	template: `<div>
		<div v-if='!browserSupportsRecording'>This browser does not support audio recording.</div>
		<div v-else-if='mediaRecorder'>
			<div>
				<button @click='prevTextSample' :disabled='disableTextSampleControls'><</button>
				<button @click='getNewTextSamples' :disabled='disableTextSampleControls'>New Phrases</button>
				<button @click='nextTextSample' :disabled='disableTextSampleControls'>></button>
				<pre v-html='activeTextSample.text' class='sample-text''></pre>
			</div>
			<button @click='beginRecording' v-show='!listening' :disabled='disableRecordingControls'>Record</button>
			<button @click='endRecording' v-show='listening' :disabled='disableRecordingControls'>Stop</button>
			<div v-if='audioSrc'>
				<audio :src='audioSrc' controls></audio>
			</div>
		</div>
	</div>`,
	created: function() {
		if (this.browserSupportsRecording) {
			this.initMediaDevices();
			this.nextTextSample();
		}
	},
	data: function() {
		return {
			activeTextSample: null,
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
		mediaDevices: function() { return navigator.mediaDevices; },
		browserSupportsRecording: function() { return this.mediaDevices; },
		disableTextSampleControls: function() { return this.listening || this.processingNewRecording || this.gettingTextSamples; },
		disableRecordingControls: function() { return this.gettingTextSamples; }
	},
	methods: {
		initMediaDevices: function() {
			this.mediaDevices.getUserMedia(this.constraints)
			.then((stream) => {

				mediaRecorder = new MediaRecorder(stream);

				mediaRecorder.onstop = (e) => {
					this.newRecording();
				};

				mediaRecorder.ondataavailable = (e) => {
					this.chunks.push(e.data);
				};

				this.mediaRecorder = mediaRecorder;
			})
			.catch((err) => {
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
		}
	}
});