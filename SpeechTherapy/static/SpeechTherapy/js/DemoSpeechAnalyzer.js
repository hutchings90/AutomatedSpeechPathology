class DemoSpeechAnalyzer extends SpeechToText {
	constructor(url, handlers) {
		super('Demo Speech Analyzer', handlers, true);
		this.xhr = new SpeechTherapyRequester({
			url: url,
			onSuccess: (response) => this._onSuccess(response),
			onError: (response, status) => this._onError(response, status),
			onComplete: (response) => this._onComplete(response)
		});
	}

	submit(data) {
		super.submit(data);
		this.xhr.submit();
	}

	updateCSRFToken(csrfToken) {
		this.xhr.updateCSRFToken(csrfToken);
	}
}