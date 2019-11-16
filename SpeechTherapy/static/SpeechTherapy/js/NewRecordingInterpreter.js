class NewRecordingInterpreter {
	constructor(onSuccess, onError, onComplete) {
		this.speechAnalyzers = [
			// MicrosoftCognitiveServices in SpeechTherapy\static\SpeechTherapy\js\MicrosoftCognitiveServices.js
			new MicrosoftCognitiveServices('90c7f27dc7f74a2eb3d5cac69f4854e8', 'https://westus2.api.cognitive.microsoft.com/sts/v1.0/issueToken', 'https://westus2.stt.speech.microsoft.com/speech/recognition/interactive/cognitiveservices/v1?cid=1913467d-893a-4920-bf25-b79150b41bb6', onSuccess, onError, onComplete),
			// Add speech-to-text services that have been built here.
			// Comment services out to keep them from being used.
		];
	}

	submit(data) {
		for (var i = this.speechAnalyzers.length - 1; i >= 0; i--) {
			this.speechAnalyzers[i].submit(data);
		}
	}
}