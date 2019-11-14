class TextSamplesImporter extends SpeechTherapyRequester {
	submit(file) {
		let data = new FormData();
		data.append('textSamples', file);
		super.submit(data);
	}
}