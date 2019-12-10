class SpeechToText {
	constructor(name, handlers, usesOwnServer) {
		this.usesOwnServer = usesOwnServer;
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
	 * All classes that inherit from this class and have usesOwnServer
	 * set to true should implement this method in order to maintain
	 * access to the server.
	 */
	updateCSRFToken(csrfToken) {}
}