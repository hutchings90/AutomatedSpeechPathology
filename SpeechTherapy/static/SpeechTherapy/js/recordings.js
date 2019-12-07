Vue.component('recordings', {
	props: [ 'recordings', 'recordingCount', 'sharedData' ],
	template: `<div>
		<div>
			<button v-if='activePageNumber > 4'><<</button>
			<button v-if='activePageNumber > 5'><</button>
			<label class='page-marker'
				v-for='pageNumber in displayedPages'
				:class='{"active": pageNumber == activePageNumber }'
				:key='pageNumber'>
				<input v-model.number='activePageNumber' :value='pageNumber' type='radio' class='button'/>
				<span v-html='pageNumber'></span>
			</label>
			<button v-if='activePageNumber < pageCount - 4'>></button>
			<button v-if='activePageNumber < pageCount - 5'>>></button>
			<div class='total-page-report'><span v-html='pageCount'></span> Pages</div>
			<div class='recordings-page-input-container'>
				<span>
					<label>Current page:</label>
					<input v-model.number.lazy='activePageNumber' type='number' min='1' max='pageCount'/>
				</span>
				<span>
					<label>Results per page:</label>
					<input v-model.number.lazy='recordingsPerPage' type='number' min='10'/>
				</span>
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
			sampleTextRecording: null,
			audioRecording: null
		};
	},
	computed: {
		pageCount: function() { return Math.ceil(this.recordingCount / this.recordingsPerPage); },
		displayedPages: function() {
			let min = Math.max(1, this.activePageNumber - 3);
			let max = Math.min(this.pageCount, min + 6);
			let pages = [];

			if (max - 6 < min) min = Math.max(1, max - 6);

			for (var i = min; i <= max; i++) {
				pages.push(i);
			}

			return pages;
		},
		recordingsPerPage: {
			get: function() {
				return this.sharedData.recordingsPerPage;
			},
			set: function(recordingsPerPage) {
				this.sharedData.recordingsPerPage = recordingsPerPage;
			}
		}
	},
	watch: {
		activePageNumber: function() {
			this.getRecordings(this.activePageNumber);
		},
		recordingsPerPage: function(newVal, oldVal) {
			if (this.recordingsPerPage < 10) this.recordingsPerPage = 10;
			else {
				// Store page number that will be used after the recordings have been retrieved.
				// Currently, it makes sure that the first recording on the current page remains visible.
				let i = ((this.activePageNumber - 1) * oldVal) + 1; // Index of first recording on active page, using 1-based indexing.
				let pageNumberAfterGetRecordings = Math.ceil(i / this.recordingsPerPage); // Page number that will have recording i on the page.
				this.getRecordings(pageNumberAfterGetRecordings);
			}
		},
		pageNumberAfterGetRecordings: function() {
			this.activePageNumber = this.pageNumberAfterGetRecordings;
		}
	},
	methods: {
		resetRecordings: function() {
			this.setAudioRecording();
			this.activePageNumber = 1;
			this.recordingsPerPage = 10;
			this.getRecordings(this.activePageNumber);
		},
		getRecordings: function(pageNumberAfterGetRecordings) {
			this.$emit('get-recordings', {
				page: this.activePageNumber,
				pageNumberAfterGetRecordings: pageNumberAfterGetRecordings,
			});
		},
		setAudioRecording: function(recording) {
			this.audioRecording = recording;
		}
	}
});