class SpeechToText {
	constructor(onSaveNewRecording) {
		this.onSaveNewRecording = onSaveNewRecording;
		this.data = null;
	}

	saveNewRecording(displayText) {
		// TODO: Assign score for recording.
		// Can speech-to-text processor do it?
		// Should it be done by the SpeechTherapy app?
		this.data.interpretation = displayText;
		this.onSaveNewRecording(this.data);
	}
}