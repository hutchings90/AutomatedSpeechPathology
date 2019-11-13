class SpeechToText {
	constructor(onSaveNewRecording) {
		this.onSaveNewRecording = onSaveNewRecording;
		this.data = null;
	}

	saveNewRecording(displayText) {
		this.data.interpretation = displayText;
		this.onSaveNewRecording(this.data);
	}
}