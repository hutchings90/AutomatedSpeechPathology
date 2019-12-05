class SpeechToText {
	constructor(handlers) {
		Object.assign(this, handlers);
		this.data = null;
	}

	onSuccess(response) {}
	_onSuccess(response) {
		this.data.interpretation = response;
		this.onSuccess(this.data);
	}

	onError(response, status) {}
	_onError(response, status) {
		this.onError(response, status);
	}

	onComplete(response) {}
	_onComplete(response) {
		this.onComplete(response);
	}

	/**
	 * All classes that inherit from this class should call super.submit in order to set this.data properly.
	 */
	submit(data) {
		this.data = data;
	}
}