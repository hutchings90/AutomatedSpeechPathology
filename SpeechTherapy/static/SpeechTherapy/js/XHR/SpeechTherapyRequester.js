/**
 * @file
 * Provides the SpeechTherapyRequester wrapper class.
 *
 */

/**
 * The SpeechTherapyRequester wrapper class. Extends XHR.
 */
class SpeechTherapyRequester extends XHR {
	/**
	 * Initializes data members.
	 * 
	 * @param {Object} options Any options that will be used by the XHMLttpRequest
	 */
	constructor(options) {
		options.withCredentials = true;
		super(options);
	}

	/**
	 * Updates the value of the X-CSRFToken header that will be sent by an XMLHttpRequest.
	 * 
	 * @param {string} csrfToken The Cross-site Request Forgery token to be updated
	 */
	updateCSRFToken(csrfToken) {
		this.updateHeader('X-CSRFToken', csrfToken);
	}
}