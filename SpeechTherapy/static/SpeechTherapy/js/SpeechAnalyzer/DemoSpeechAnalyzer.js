/**
 * @file
 * Provides demo classes that extend SpeechAnalyzer.
 *
 */

/**
 * The DemoFrontEndSpeechAnalyzer class. Extends SpeechAnalyzer. For use in demonstrating the
 * capabilities of the website.
 */
class DemoFrontEndSpeechAnalyzer extends SpeechAnalyzer {
	// Static getter for possible speech-to-text results.
	static get resultOptions() {
		return [
			// First ten Harvard Sentences
			'Glue the sheet to the dark blue background.',
			'It\'s easy to tell the depth of a well.',
			'These days a chicken leg is a rare dish.',
			'Rice is often served in round bowls.',
			'The juice of lemons makes fine punch.',
			'The box was thrown beside the parked truck.',
			'The hogs were fed chopped corn and garbage.',
			'Four hours of steady work faced us.',
			'Large size in stockings is hard to sell.',
			'The birch canoe slid on the smooth planks.',
			// Every tenth Harvard Sentence, beginning at 20
			'A rod is used to catch pink salmon.',
			'The fish twisted and turned on the bent hook.',
			'Take the winding path to reach the lake.',
			'The ship was torn apart on the sharp reef.',
			'The crooked maze failed to fool the mouse.',
			'Use a pencil to write the first draft.',
			'The two met while playing on the sand.',
			'See the cat glaring at the scared mouse.',
			'A wisp of cloud hung in the blue air.',
		];
	}

	/**
	 * Initializes data members.
	 * 
	 * @param {Object} handlers The handlers Object to be passed to the SpeechAnalyzer constructor
	 */
	constructor(handlers) {
		super('Demo Front End Speech Analyzer', handlers);
	}

	/**
	 * Submits the data for speech-to-text analysis.
	 * 
	 * @param {Object} data The relevant data
	 */
	submit(data) {
		super.submit(data);
		this._onSuccess(this.getRandomResults());
		this._onComplete();
	}

	/**
	 * Gets a random result from the static results getter.
	 * 
	 * @return {string} The random speech-to-text results
	 */
	getRandomResults() {
		return this.constructor.resultOptions[Math.floor(Math.random() * this.constructor.resultOptions.length)];
	}
}

/**
 * The DemoFrontEndSpeechAnalyzer class. Extends SpeechAnalyzer. For use in demonstrating the
 * capabilities of the website.
 */
class DemoXHRSpeechAnalyzer extends SpeechAnalyzer {
	/**
	 * Initializes data members.
	 * 
	 * @param {string} url The url that data will be sent to for speech-to-text analysis
	 * @param {Object} handlers The handlers Object to be passed to the SpeechAnalyzer constructor
	 */
	constructor(url, handlers) {
		super('Demo XHR Speech Analyzer', handlers);
		this.addSpeechTherapyRequester('main', new SpeechTherapyRequester({
			url: url,
			onSuccess: response => this._onSuccess(response),
			onError: (response, status) => this._onError(response, status),
			onComplete: response => this._onComplete(response)
		}));
	}

	/**
	 * Submits the data for speech-to-text analysis.
	 * 
	 * @param {Object} data The relevant data
	 */
	submit(data) {
		super.submit(data);
		this.speechTherapyRequesters.main.submit();
	}
}