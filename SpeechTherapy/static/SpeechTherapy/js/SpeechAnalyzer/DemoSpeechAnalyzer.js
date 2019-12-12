class DemoFrontEndSpeechAnalyzer extends SpeechAnalyzer {
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

	constructor(handlers) {
		super('Demo Front End Speech Analyzer', handlers);
	}

	submit(data) {
		super.submit(data);
		this._onSuccess(this.getRandomResults());
		this._onComplete();
	}

	getRandomResults() {
		return this.constructor.resultOptions[Math.floor(Math.random() * this.constructor.resultOptions.length)];
	}
}

class DemoXHRSpeechAnalyzer extends SpeechAnalyzer {
	constructor(url, handlers) {
		super('Demo XHR Speech Analyzer', handlers);
		this.addSpeechTherapyRequester('main', new SpeechTherapyRequester({
			url: url,
			onSuccess: (response) => this._onSuccess(response),
			onError: (response, status) => this._onError(response, status),
			onComplete: (response) => this._onComplete(response)
		}));
	}

	submit(data) {
		super.submit(data);
		this.speechTherapyRequesters.main.submit();
	}
}