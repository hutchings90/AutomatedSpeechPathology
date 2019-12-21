/**
 * @file
 * Provides the SpeechAnalyzer base class.
 *
 */

/**
 * The SpeechAnalyzer base class. This class is to be used by anything that will convert user audio
 * to text.
 */
class SpeechAnalyzer {
	/**
	 * Initializes data members. In hindsight, the index data member may not have been the best
	 * practice as it tightly couples the SpeechAnalyzer class to the NewRecordingInterpreter
	 * class.
	 * 
	 * @param {string} name The name of the SpeechAnalyzer
	 * @param {Object} handlers Contains any key/value pairs that should be used by the
	 *   SpeechAnalyzer. onSuccess, onComplete, onError are typically overridden in this parameter.
	 */
	constructor(name, handlers) {
		Object.assign(this, handlers);
		this.data = null;
		this.name = name;
		this.index = -1;
		this.speechTherapyRequesters = {};
	}

	/**
	 * Should be called when the speech-to-text analysis has been successfully completed. Calls
	 * onSuccess.
	 * 
	 * @param {string} interpretation The text results of the speech-to-text analysis
	 */
	_onSuccess(interpretation) {
		this.data.interpretation = interpretation;
		this.onSuccess(this.index, this.data);
	}

	/**
	 * A stub to be overridden by a value in the handlers object of the constructor. Called by
	 * _onSuccess.
	 * 
	 * @param {number} index The position of this SpeechAnalyzer within an instance of
	 *   NewRecordingInterpreter.
	 * @param {Object} data The relevant data
	 */
	onSuccess(index, data) {}

	/**
	 * Should be called when the speech-to-text analysis has failed. Calls onError.
	 * 
	 * @param {mixed} response The response from the speech-to-text analysis
	 * @param {int} status The HTTP status code of the response
	 */
	_onError(response, status) {
		this.onError(this.index, response, status);
	}

	/**
	 * A stub to be overridden by a value in the handlers object of the constructor. Called by
	 * _onError.
	 * @param {number} index The position of this SpeechAnalyzer within an instance of
	 *   NewRecordingInterpreter.
	 * @param {mixed} response The response from the speech-to-text analysis
	 * @param {int} status The HTTP status code of the response
	 */
	onError(index, response, status) {}

	/**
	 * Should be called when the speech-to-text analysis has been completed, regardless of success
	 * or error. Calls onComplete.
	 * 
	 * @param {mixed} response The response from the speech-to-text analysis
	 */
	_onComplete(response) {
		this.onComplete(this.index, response);
	}

	/**
	 * A stub to be overridden by a value in the handlers object of the constructor. Called by
	 * _onComplete.
	 * 
	 * @param {mixed} response The response from the speech-to-text analysis
	 */
	onComplete(response) {}

	/**
	 * Sets the data data member. All classes that inherit from this class should call super.submit
	 * in their submit method in order to set the data data member properly.
	 * 
	 * @param {Object} data The relevant data
	 */
	submit(data) {
		this.data = data;
	}

	/**
	 * Adds an instance of SpeechTherapyRequester.
	 * 
	 * @param {name} name The name of the SpeechTherapyRequester
	 * @param {speechTherapyRequester} speechTherapyRequester Instance of SpeechTherapyRequester to
	 *   be added
	 */
	addSpeechTherapyRequester(name, speechTherapyRequester) {
		this.speechTherapyRequesters[name] = speechTherapyRequester;
	}

	/**
	 * Calls the updateCSRFToken method of each item in the speechTherapyRequesters data member.
	 * 
	 * @param {string} csrfToken The CSRF token to be used by any instances of
	 *   SpeechTherapyRequesters
	 */
	updateCSRFToken(csrfToken) {
		for (let key in this.speechTherapyRequesters) {
			this.speechTherapyRequesters[key].updateCSRFToken(csrfToken);
		}
	}
}