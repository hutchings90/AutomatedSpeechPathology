class NewTextSamplesGetter extends SpeechTherapyRequester {
	submit(id, ts) {
		let data = new FormData();
		data.append('id', id);
		data.append('ts', ts);
		super.submit(data);
	}
}