class MicrosoftCognitiveServices extends SpeechToText {
	constructor(subscriptionKey, tokenUrl, speechToTextUrl, handlers) {
		super('Microsoft Cognitive Services', handlers);
		this.issueTokenXHR = new XHR({
			url: tokenUrl,
			headers: {
				'Ocp-Apim-Subscription-Key': subscriptionKey
			},
			onSuccess: (response) => this.getTextFromRecording(response),
			onError: (response, status) => {
				this._onError(response, status);
				// Call onComplete since it won't get called by speechToTextXHR's onComplete
				this._onComplete(response);
			}
			// Don't set onComplete since it isn't complete until the speechToTextXHR's onComplete
		});
		this.speechToTextXHR = new XHR({
			url: speechToTextUrl,
			onSuccess: (response) => {
				if (response.RecognitionStatus == 'Success') this._onSuccess(response.DisplayText);
				else this._onError(response.RecognitionStatus, 200);
			},
			onError: (response, status) => this._onError(response, status),
			onComplete: (response) => this._onComplete(response)
		});
	}

	submit(data) {
		super.submit(data);
		this.issueTokenXHR.submit();
	}

	getTextFromRecording(token) {
		this.speechToTextXHR.updateHeader('Authorization', 'Bearer ' + token);
		this.speechToTextXHR.submit(this.data.blob);
	}
}