class TextSamplesImporter extends SpeechTherapyRequester {
	submit(ts, file) {
		let data = new FormData();
		data.append('ts', ts);
		data.append('textSamples', file);
		super.submit(data);
	}
}