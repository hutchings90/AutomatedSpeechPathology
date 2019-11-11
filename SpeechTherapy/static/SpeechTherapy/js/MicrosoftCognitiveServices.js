class MicrosoftCognitiveServices extends SpeechToText {
	constructor(subscriptionKey, tokenUrl, speechToTextUrl, onSaveNewRecording) {
		super(onSaveNewRecording);
		this.issueTokenXHR = new XHR({
			url: tokenUrl,
			headers: {
				'Ocp-Apim-Subscription-Key': subscriptionKey
			},
			onSuccess: (response) => {
				this.getTextFromRecording(response);
			},
			onError: (response, status) => {
				this.data = null;
				// TODO: Display get token error.
			}
		});
		this.speechToTextXHR = new XHR({
			url: speechToTextUrl,
			onSuccess: (response) => {
				if (response.RecognitionStatus != 'Success') {
					// TODO: Display speech to text processing error.
					return;
				}
				this.saveNewRecording(response.DisplayText);
			},
			onError: (response, status) => {
				// TODO: Display speech-to-text error.
			},
			onComplete: (response) => {
				this.data = null;
			}
		});
	}

	submit(data) {
		this.data = data;
		// TODO: Remove call to saveNewRecording and uncomment call to issueTokenXHR.submit once speech-to-text working.
		this.saveNewRecording('asdf');
		// this.issueTokenXHR.submit();
	}

	getTextFromRecording(token) {
		this.speechToTextXHR.updateHeader('Authorization', 'Bearer ' + token);
		this.speechToTextXHR.submit(this.data.blob);
	}
}