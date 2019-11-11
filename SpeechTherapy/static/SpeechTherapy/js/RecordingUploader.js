class RecordingUploader extends SpeechTherapyRequester {
	submit(data) {
		let blob = data.blob;
		let formData = new FormData();
		formData.append('audio', blob, blob.filename);
		formData.append('text_sample_id', data.text_sample_id);
		formData.append('interpretation', data.interpretation);
		super.submit(formData);
	}
}