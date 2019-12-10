class RecordingUploader extends SpeechTherapyRequester {
	submit(newRecordingResultsIndex, recordingsPerPage, ts, data) {
		let blob = data.blob;
		let formData = new FormData();
		formData.append('newRecordingResultsIndex', newRecordingResultsIndex);
		formData.append('recordingsPerPage', recordingsPerPage);
		formData.append('audio', blob, blob.filename);
		formData.append('text_sample_id', data.text_sample_id);
		formData.append('interpretation', data.interpretation);
		formData.append('ts', ts);
		super.submit(formData);
	}
}