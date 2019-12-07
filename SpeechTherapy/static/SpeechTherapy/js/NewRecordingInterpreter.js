class NewRecordingInterpreter {
	constructor(demoUrl, handlers) {
		this.demoSpeechAnalyzerCount = 5;
		this.demoUrl = demoUrl;
		this.handlers = handlers;
		this.initSpeechAnalyzers();
	}

	initSpeechAnalyzers() {
		this.speechAnalyzers = [];

		// Make DemoSpeechAnalyzers (see SpeechTherapy\static\SpeechTherapy\js\DemoSpeechAnalyzer.js).
		for (var i = 0; i < this.demoSpeechAnalyzerCount; i++) {
			this.addSpeechAnalyzer(new DemoSpeechAnalyzer(this.demoUrl, this.handlers));
		}

		// TODO: Add speech-to-text services that have been built here.
		// Example for MicrosoftCognitiveServices.
		// this.addSpeechAnalyzer(new MicrosoftCognitiveServices(subscriptionKey, tokenUrl, speechToTextUrl, handlers));
	}

	addSpeechAnalyzer(speechAnalyzer) {
		speechAnalyzer.index = this.speechAnalyzers.length;
		this.speechAnalyzers.push(speechAnalyzer);
		speechAnalyzer.name = this.speechAnalyzers.length + ': ' + speechAnalyzer.name;
	}

	submit(data) {
		this.speechAnalyzers.forEach(speechAnalyzer => speechAnalyzer.submit(data));
	}

	updateCSRFToken(csrfToken) {
		this.speechAnalyzers.forEach(speechAnalyzer => speechAnalyzer.updateCSRFToken(csrfToken));
	}

	get names() {
		return this.speechAnalyzers.map(speechAnalyzer => speechAnalyzer.name);
	}
}