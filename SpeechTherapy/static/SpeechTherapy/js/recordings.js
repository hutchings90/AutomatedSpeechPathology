Vue.component('recordings', {
	props: [ 'recordings', 'recordingCount', 'gettingRecordings', 'shown', 'recordedSinceGetRecordings' ],
	template: `<div>
		<div v-show='showFilters'>
			<label class='page-marker'
				v-show='showPageNumbers'
				v-for='pageNumber in pageCount'
				:class='{"active": pageNumber == activePageNumber }'>
				<input v-model.number='activePageNumber' :value='pageNumber' type='radio' class='hide'/>
				<span v-html='pageNumber'></span>
			</label>
			<div class='results-per-page-input'>
				<label>Results per page:</label>
				<input v-model.number.lazy='recordsPerPage' type='number' min='10' class='records-per-page'/>
			</div>
		</div>
		<table class='recordings-table'>
			<thead>
				<tr>
					<th></th>
					<th>Timestamp</th>
					<th>Text Sample</th>
					<th>Interpretation</th>
					<th>Score</th>
				</tr>
			</thead>
			<tbody>
				<recording
					v-for='recording in recordings'
					@play-recording='setAudioRecording'
					:key='recording.id'
					:recording='recording'
					:audio-recording='audioRecording'></recording>
			</tbody>
		</table>
	</div>`,
	data: function() {
		return {
			activePageNumber: 1,
			recordsPerPage: 10,
			sampleTextRecording: null,
			audioRecording: null
		};
	},
	computed: {
		hasRecordings: function() { return this.recordings.length > 0; },
		displayNoneFoundMessage: function() { return !this.hasRecordings && !this.gettingRecordings; },
		pageCount: function() { return Math.ceil(this.recordingCount / this.recordsPerPage); },
		hasMultiplePages: function() { return this.pageCount > 1; },
		showFilters: function() { return this.hasRecordings; },
		showPageNumbers: function() { return this.hasMultiplePages; },
	},
	watch: {
		shown: function() {
			this.resetRecordings();
		},
		recordedSinceGetRecordings: function() {
			this.resetRecordings();
		},
		activePageNumber: function() {
			this.getRecordings();
		},
		recordsPerPage: function() {
			if (this.recordsPerPage < 10) this.recordsPerPage = 10;
			else this.getRecordings();
		}
	},
	methods: {
		resetRecordings: function() {
			this.setAudioRecording();
			if (!this.shown || !this.recordedSinceGetRecordings) return;
			this.activePageNumber = 1;
			this.recordsPerPage = 10;
			this.getRecordings();
		},
		getRecordings: function() {
			this.$emit('get-recordings', {
				page: this.activePageNumber,
				recordsPerPage: this.recordsPerPage
			});
		},
		setAudioRecording: function(recording) {
			this.audioRecording = recording;
		}
	}
});