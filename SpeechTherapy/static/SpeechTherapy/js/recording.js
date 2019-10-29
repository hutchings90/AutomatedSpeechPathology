Vue.component('recording', {
	props: [ 'recording', 'sampleTextRecording', 'audioRecording' ],
	template: `<tr>
		<td class='audio-controls'>
			<label class='checkbox-button'>
				<span v-html='playHTML'></span>
				<input v-model='shouldPlay' type='checkbox'/>
			</label>
			<audio ref='audio' :src='recording.audioSrc' @ended='stop'></audio>
		</td>
		<td>
			<div v-html='dateDisplay'></div>
			<div v-html='timeDisplay'></div>
		</td>
		<td v-show='!showSampleText' @click='setSampleTextRecording(recording)' class='recording-name'>
			<span v-html='recording.name'></span>
		</td>
		<td v-show='showSampleText' @click='setSampleTextRecording' class='recording-text'>
			<div class='info-container'>
				<pre v-html='recording.text' class='sample-text info-content'></pre>
			</div>
		</td>
		<td>
			<pre v-html='recording.interpretation' class='sample-text'></pre>
		</td>
		<td v-html='recording.score'></td>
	</tr>`,
	data: function() {
		return {
			shouldPlay: false,
			isStopping: false
		};
	},
	computed: {
		dateDisplay: function() {
			return (new Date(this.recording.date_recorded)).toLocaleString('default', {
				month: 'numeric',
				year: 'numeric',
				day: 'numeric'
			});
		},
		timeDisplay: function() {
			return (new Date(this.recording.date_recorded)).toLocaleString('default', {
				hour: 'numeric',
				minute: '2-digit'
			});
		},
		showSampleText: function() { return this.recording == this.sampleTextRecording; },
		playHTML: function() { return this.shouldPlay ? '&#10074;&#10074;' : '&#9658;'; },
		audio: function() { return this.$refs.audio; }
	},
	watch: {
		shouldPlay: function() {
			if (this.isStopping) this.isStopping = false;
			else if (this.audioRecording != this.recording) this.$emit('play-recording', this.recording);
			else if (this.shouldPlay) this.play();
			else this.pause();
		},
		audioRecording: function() {
			if (this.audioRecording == this.recording) this.play();
			else {
				let wasPlaying = this.shouldPlay;
				this.stop();
				if (!wasPlaying) this.isStopping = false;
			}
		}
	},
	methods: {
		setSampleTextRecording: function(recording) {
			this.$emit('set-sample-text-recording', recording);
		},
		play: function() {
			this.audio.play();
			this.shouldPlay = true;
		},
		pause: function() {
			this.audio.pause();
			this.shouldPlay = false;
		},
		stop: function() {
			this.pause();
			this.audio.currentTime = 0;
			this.isStopping = true;
		}
	}
});