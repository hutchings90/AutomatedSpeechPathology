class MicrosoftCognitiveServices extends SpeechToText {
	constructor(subscriptionKey, tokenUrl, speechToTextUrl, onSaveNewRecording, onComplete) {
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
				// Call onComplete since it won't get called by speechToTextXHR's onComplete
				this.onComplete(response);
				// TODO: Display get token error.
			}
			// Don't set onComplete since it isn't complete until the speechToTextXHR's onComplete
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
				this.onComplete(response);
			}
		});
	}

	submit(data) {
		this.data = data;
		this.issueTokenXHR.submit();
	}

	getTextFromRecording(token) {
		this.speechToTextXHR.updateHeader('Authorization', 'Bearer ' + token);
		this.speechToTextXHR.submit(this.data.blob);
	}
}