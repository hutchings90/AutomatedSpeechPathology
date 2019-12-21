/**
 * @file
 * Provides the NewRecordingInterpreter class.
 *
 */

/**
 * The NewRecordingInterpreter class.
 */
class NewRecordingInterpreter {
	/**
	 * Initializes data members.
	 * 
	 * @param {string} demoUrl The url used for instances of DemoXHRSpeechAnalyzer
	 * @param {Object} handlers The handlers Object to be passed to the SpeechAnalyzer constructor
	 */
	constructor(demoUrl, handlers) {
		this.demoXHRSpeechAnalyzerCount = 1; // Number of DemoSpeechAnalyzer instances to put into this.speechAnalyzers.
		this.demoFrontEndSpeechAnalyzerCount = 1; // Number of DemoSpeechAnalyzer instances to put into this.speechAnalyzers.
		this.demoUrl = demoUrl;
		this.handlers = handlers;
		this.initSpeechAnalyzers();
	}

	/**
	 * Initializes the speechAnalyzers data member. Demo SpeechAnalyzers are created based on the
	 * respective count value. Other derived SpeechAnalyzers should be added here using the
	 * addSpeechAnalyzer method.
	 */
	initSpeechAnalyzers() {
		this.speechAnalyzers = [];

		// Make DemoSpeechAnalyzers (see SpeechTherapy\static\SpeechTherapy\js\DemoSpeechAnalyzer.js).
		for (var i = 0; i < this.demoXHRSpeechAnalyzerCount; i++) {
			this.addSpeechAnalyzer(new DemoXHRSpeechAnalyzer(this.demoUrl, this.handlers));
		}

		for (var i = 0; i < this.demoFrontEndSpeechAnalyzerCount; i++) {
			this.addSpeechAnalyzer(new DemoFrontEndSpeechAnalyzer(this.handlers));
		}

		// TODO: Add speech-to-text services that have been built here.
		// Example for MicrosoftCognitiveServices.
		// this.addSpeechAnalyzer(new MicrosoftCognitiveServices(subscriptionKey, tokenUrl, speechAnalyzerUrl, handlers));
	}

	/**
	 * Adds an instance of a class derived from the SpeechAnalyzer base class.
	 * 
	 * @param {SpeechAnalyzer} speechAnalyzer The instance of a class derived from the
	 *   SpeechAnalyzer base class added
	 */
	addSpeechAnalyzer(speechAnalyzer) {
		speechAnalyzer.index = this.speechAnalyzers.length;
		this.speechAnalyzers.push(speechAnalyzer);
		speechAnalyzer.name = this.speechAnalyzers.length + ': ' + speechAnalyzer.name;
	}

	/**
	 * Calls the submit method for each item in the speechAnalyzers data member.
	 * 
	 * @param {Object} data The relevant data
	 */
	submit(data) {
		this.speechAnalyzers.forEach(speechAnalyzer => speechAnalyzer.submit(data));
	}

	/**
	 * Calls updateCSRFToken for each item in the speechAnalyzers data member.
	 * 
	 * @param {string} csrfToken Cross-site Request Forgery token
	 */
	updateCSRFToken(csrfToken) {
		this.speechAnalyzers.forEach(speechAnalyzer => speechAnalyzer.updateCSRFToken(csrfToken));
	}

	/**
	 * Gets the names associated with each item in the speechAnalyzers data member. The index of
	 * the name within the list matches the index of the item within the speechAnalyzers data
	 * member.
	 * 
	 * @return {Array} The names associated with each item in the speechAnalyzers data member
	 */
	get names() {
		return this.speechAnalyzers.map(speechAnalyzer => speechAnalyzer.name);
	}
}