class RecordingsGetter extends SpeechTherapyRequester {
	submit(page, recordsPerPage) {
		let data = new FormData();
		data.append('page', page);
		data.append('recordsPerPage', recordsPerPage);
		super.submit(data);
	}
}