class RecordingsGetter extends SpeechTherapyRequester {
	submit(page, recordingsPerPage, pageNumberAfterGetRecordings, ts) {
		let data = new FormData();
		data.append('page', page);
		data.append('recordingsPerPage', recordingsPerPage);
		data.append('pageNumberAfterGetRecordings', pageNumberAfterGetRecordings);
		data.append('ts', ts);
		super.submit(data);
	}
}