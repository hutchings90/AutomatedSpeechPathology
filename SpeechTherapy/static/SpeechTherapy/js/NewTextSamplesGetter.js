class NewTextSamplesGetter extends SpeechTherapyRequester {
	submit(id) {
		let data = new FormData();
		data.append('id', id);
		super.submit(data);
	}
}