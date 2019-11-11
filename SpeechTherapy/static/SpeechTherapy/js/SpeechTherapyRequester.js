class SpeechTherapyRequester extends XHR {
	constructor(csrfToken, options) {
		options.withCredentials = true;
		super(options);
		this.updateCSRFToken(csrfToken);
	}

	updateCSRFToken(csrfToken) {
		this.updateHeader('X-CSRFToken', csrfToken);
	}
}