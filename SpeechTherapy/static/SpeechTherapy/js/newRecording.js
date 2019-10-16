Vue.component('new-recording', {
	props: [ 'gettingTextSamples', 'processing', 'textSamples' ],
	template: `<div>
		<div v-if='!browserSupportsRecording'>This browser does not support audio recording.</div>
		<div v-else-if='mediaRecorder'>
			<div>
				<button @click='prevTextSample'><</button>
				<button @click='nextTextSample'>></button>
				<p v-html='activeTextSample.text'></p>
			</div>
			<button @click='toggleRecording' :class='recordingClass'>&#9899</button>
			<div v-if='audioSrc'>
				<audio :src='audioSrc' controls></audio>
				<div v-html='name'></div>
			</div>
		</div>
	</div>`,
	created: function() {
		this.nextTextSample();
		this.mediaDevices.getUserMedia(this.constraints)
		.then((stream) => {

			mediaRecorder = new MediaRecorder(stream);

			mediaRecorder.onstop = (e) => {
				this.name = this.generateClipName();
				this.audioSrc = URL.createObjectURL(new Blob(this.chunks, { type: 'audio/ogg; codecs=opus' }));
				this.chunks = [];
				this.listening = false;
				this.$emit('new-recording', {
					blob: new Blob(this.chunks, { type: 'text/plain'}),
					name: this.name,
					text_sample_id: this.activeTextSample.id
				});
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
	data: function() {
		return {
			activeTextSample: null,
			listening: false,
			audioSrc: '',
			name: '',
			timeout: null,
			maxTime: 30000,
			mediaRecorder: null,
			chunks: [],
			constraints: {
				audio: true
			}
		};
	},
	computed: {
		mediaDevices: function() { return navigator.mediaDevices; },
		browserSupportsRecording: function() { return this.mediaDevices; },
		recordingClass: function() {
			return {
				'begin-recording': !this.listening,
				'end-recording': this.listening
			};
		}
	},
	methods: {
		nextTextSample: function() {
			this.setActiveTextSample(this.textSamples.indexOf(this.activeTextSample) + 1);
		},
		prevTextSample: function() {
			this.setActiveTextSample(this.textSamples.indexOf(this.activeTextSample) - 1);
		},
		setActiveTextSample: function(i) {
			if (this.textSamples.length < 1) {
				this.activeTextSample = {
					id: null,
					text: 'No text samples were found. Searching for new text samples...'
				};
				this.$emit('get-new-text-samples');
			}
			else {
				if (i >= this.textSamples.length) i = 0;
				else if (i < 0) i = this.textSamples.length - 1;
				this.activeTextSample = this.textSamples[i];
			}
		},
		toggleRecording: function() {
			this.mediaRecorder.state == 'recording' ? this.endRecording() : this.beginRecording();
		},
		endRecording: function() {
			clearTimeout(this.timeout);
			this.timeout = null;
			this.mediaRecorder.stop();
		},
		beginRecording: function() {
			this.audioSrc = '';
			this.name = '';
			this.chunks = [];
			this.mediaRecorder.start();
			this.listening = true;
			this.timeout = setTimeout(() => {
				this.endRecording();
			}, this.maxTime);
		},
		generateClipName: function() {
			let date = new Date();
			let month = date.toLocaleString('default', { month: 'short' });
			let day = date.getDate();
			let year = date.getFullYear();
			let dateString = month + ' ' + day + ', ' + year;
			let hour = date.getHours();
			let minute = date.getMinutes();
			let second = date.getSeconds();
			let timeString = hour + ':' + minute + ':' + second;
			return dateString + ' ' + timeString;
		}
	}
});