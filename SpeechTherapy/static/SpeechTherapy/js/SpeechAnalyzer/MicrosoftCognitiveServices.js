class MicrosoftCognitiveServices extends SpeechAnalyzer {
	constructor(subscriptionKey, tokenUrl, speechAnalyzerUrl, handlers) {
		super('Microsoft Cognitive Services', handlers);
		this.issueTokenXHR = new XHR({
			url: tokenUrl,
			headers: {
				'Ocp-Apim-Subscription-Key': subscriptionKey
			},
			onSuccess: (response) => this.getTextFromRecording(response),
			onError: (response, status) => {
				this._onError(response, status);
				// Call onComplete since it won't get called by speechAnalyzerXHR's onComplete
				this._onComplete(response);
			}
			// Don't set onComplete since it isn't complete until the speechAnalyzerXHR's onComplete
		});
		this.speechAnalyzerXHR = new XHR({
			url: speechAnalyzerUrl,
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
		this.speechAnalyzerXHR.updateHeader('Authorization', 'Bearer ' + token);
		this.speechAnalyzerXHR.submit(this.data.blob);
	}
}