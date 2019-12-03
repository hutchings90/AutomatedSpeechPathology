class SpeechToText {
	constructor(onSuccess, onError, onComplete) {
		this.onSuccess = onSuccess;
		this.onError = onError;
		this.onComplete = onComplete;
		this.data = null;
	}

	_onSuccess(displayText) {
		this.data.interpretation = displayText;
		this.onSuccess(this.data);
	}

	_onError(response, status) {
		this.onError(response, status);
	}

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