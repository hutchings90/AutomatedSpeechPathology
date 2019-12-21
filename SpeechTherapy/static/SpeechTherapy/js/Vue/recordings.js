Vue.component('recordings', {
	props: [ 'recordings', 'recordingCount', 'sharedData', 'pageNumberAfterGetRecordings' ],
	template: `<div>
		<div>
			<label class='page-marker'
				v-for='pageNumber in displayedPages'
				:class='{"active": pageNumber == activePageNumber }'
				:key='pageNumber'>
				<input v-model.number='activePageNumber' :value='pageNumber' type='radio' class='button'/>
				<span v-html='pageNumber'></span>
			</label>
			<div class='total-page-report'><span v-html='pageCount'></span> Page<span v-show='pageCount > 1'>s</span></div>
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
	data() {
		return {
			activePageNumber: 1,
			sampleTextRecording: null,
			audioRecording: null
		};
	},
	computed: {
		pageCount() { return Math.ceil(this.recordingCount / this.recordingsPerPage); },
		displayedPages() {
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
			get() { return this.sharedData.recordingsPerPage; },
			set(recordingsPerPage) {
				let oldVal = this.recordingsPerPage;
				this.sharedData.recordingsPerPage = recordingsPerPage;
				if (this.recordingsPerPage < 10) this.recordingsPerPage = 10;
				else {
					// Store page number that will be used after the recordings have been retrieved.
					// Currently, it makes sure that the first recording on the current page remains visible.
					let i = ((this.activePageNumber - 1) * oldVal) + 1; // Index of first recording on active page, using 1-based indexing.
					let pageNumberAfterGetRecordings = Math.ceil(i / this.recordingsPerPage); // Page number that will have recording i on the page.
					this.getRecordings(pageNumberAfterGetRecordings);
				}
			}
		}
	},
	watch: {
		activePageNumber() {
			if (this.activePageNumber > this.pageCount) this.activePageNumber = this.pageCount;
			else if (this.activePageNumber < 1) this.activePageNumber = 1;
			else this.getRecordings(this.activePageNumber);
		},
		pageNumberAfterGetRecordings() {
			this.activePageNumber = this.pageNumberAfterGetRecordings;
		}
	},
	methods: {
		resetRecordings() {
			this.setAudioRecording();
			this.activePageNumber = 1;
			this.recordingsPerPage = 10;
			this.getRecordings(this.activePageNumber);
		},
		getRecordings(pageNumberAfterGetRecordings) {
			this.$emit('get-recordings', {
				page: this.activePageNumber,
				pageNumberAfterGetRecordings: pageNumberAfterGetRecordings,
			});
		},
		setAudioRecording(recording) {
			this.audioRecording = recording;
		}
	}
});