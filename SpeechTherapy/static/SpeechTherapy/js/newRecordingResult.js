Vue.component('new-recording-result', {
	props: [ 'result', 'isRecording' ],
	template: `<div class='new-recording-result'>
		<h4 v-html='result.name' class='new-recording-result-header'></h4>
		<div>Score: <span v-html='scoreReport'></span></div>
		<div>Interpretation: <span v-html='interpretationReport' class='new-recording-result-interpretation'></span></div>
	</div>`,
	computed: {
		interpretation: function() { return this.result.interpretation; },
		score: function() { return this.result.score; },
		isScored: function() { return this.score >= 0; },
		interpretationReport: function() {
			if (this.isRecording) return '';
			if (this.interpretation) return this.interpretation;
			return 'Analyzing audio...';
		},
		scoreReport: function() {
			if (this.isRecording) return '';
			if (this.isScored) return this.score + '%';
			if (this.interpretation) return 'Scoring...';
			return 'Pending...';
		}
	}
});