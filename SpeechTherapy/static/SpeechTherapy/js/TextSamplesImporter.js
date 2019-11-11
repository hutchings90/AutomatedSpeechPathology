class TextSamplesImporter extends SpeechTherapyRequester {
	submit(directoryName) {
		let data = new FormData();
		data.append('directoryName', directoryName);
		super.submit(data);
	}
}