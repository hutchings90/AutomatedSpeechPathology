class SpeechAnalyzer {
	constructor(name, handlers) {
		Object.assign(this, handlers);
		this.data = null;
		this.name = name;
		this.index = -1;
		this.speechTherapyRequesters = {};
	}

	onSuccess(response) {}
	_onSuccess(response) {
		this.data.interpretation = response;
		this.onSuccess(this.index, this.data);
	}

	onError(response, status) {}
	_onError(response, status) {
		this.onError(this.index, response, status);
	}

	onComplete(response) {}
	_onComplete(response) {
		this.onComplete(this.index, response);
	}

	/**
	 * All classes that inherit from this class should call super.submit
	 * in order to set this.data properly.
	 */
	submit(data) {
		this.data = data;
	}

	addSpeechTherapyRequester(name, speechTherapyRequester) {
		this.speechTherapyRequesters[name] = speechTherapyRequester;
	}

	updateCSRFToken(csrfToken) {
		for (let key in this.speechTherapyRequesters) {
			this.speechTherapyRequesters[key].updateCSRFToken(csrfToken);
		}
	}
}