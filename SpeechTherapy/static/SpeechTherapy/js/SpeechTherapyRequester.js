class SpeechTherapyRequester extends XHR {
	constructor(options) {
		options.withCredentials = true;
		super(options);
	}

	updateCSRFToken(csrfToken) {
		this.updateHeader('X-CSRFToken', csrfToken);
	}
}