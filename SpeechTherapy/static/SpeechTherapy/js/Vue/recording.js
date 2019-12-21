Vue.component('recording', {
	props: [ 'recording', 'audioRecording' ],
	template: `<tr>
		<td class='audio-controls'>
			<label class='input'>
				<span v-html='playHTML'></span>
				<input v-model='shouldPlay' type='checkbox' class='button'/>
			</label>
			<audio ref='audio' :src='recording.audioSrc' @ended='stop'></audio>
		</td>
		<td>
			<div v-html='dateDisplay'></div>
			<div v-html='timeDisplay'></div>
		</td>
		<td class='text-sample-cell'>
			<pre v-html='recording.text' class='sample-text'></pre>
		</td>
		<td>
			<pre v-html='recording.interpretation'></pre>
		</td>
		<td v-html='recording.score + "%"'></td>
	</tr>`,
	data() {
		return {
			shouldPlay: false,
			isStopping: false
		};
	},
	computed: {
		dateDisplay() {
			return (new Date(this.recording.date_recorded)).toLocaleString('default', {
				month: 'numeric',
				year: 'numeric',
				day: 'numeric'
			});
		},
		timeDisplay() {
			return (new Date(this.recording.date_recorded)).toLocaleString('default', {
				hour: 'numeric',
				minute: '2-digit'
			});
		},
		playHTML() { return this.shouldPlay ? '&#10074;&#10074;' : '&#9658;'; },
		audio() { return this.$refs.audio; }
	},
	watch: {
		shouldPlay() {
			if (this.isStopping) this.isStopping = false;
			else if (this.audioRecording != this.recording) this.$emit('play-recording', this.recording);
			else if (this.shouldPlay) this.play();
			else this.pause();
		},
		audioRecording() {
			if (this.audioRecording == this.recording) this.play();
			else {
				let wasPlaying = this.shouldPlay;
				this.stop();
				if (!wasPlaying) this.isStopping = false;
			}
		}
	},
	methods: {
		play() {
			this.audio.play();
			this.shouldPlay = true;
		},
		pause() {
			this.audio.pause();
			this.shouldPlay = false;
		},
		stop() {
			this.pause();
			this.audio.currentTime = 0;
			this.isStopping = true;
		}
	}
});