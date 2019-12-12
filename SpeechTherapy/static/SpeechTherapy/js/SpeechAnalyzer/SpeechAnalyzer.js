class SpeechAnalyzer {
	constructor(name, handlers) {
		Object.assign(this, handlers);
		this.data = null;
		this.name = name;
		this.index = -1;
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

	/**
	 * All classes that inherit from this class and use this project's
	 * Django server should implement this method in order to maintain
	 * access to the server when the CSRF token changes.
	 */
	updateCSRFToken(csrfToken) {}
}