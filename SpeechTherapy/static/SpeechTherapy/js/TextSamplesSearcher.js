class TextSamplesSearcher extends SpeechTherapyRequest {
	submit(text, ts) {
		let data = new FormData();
		data.append('text', text);
		data.append('ts', ts);
		super.submit(data);
	}
}