/**
 * @file
 * Provides the MicrosoftCognitiveServices class, which extends SpeechAnalyzer.
 *
 */

/**
 * The MicrosoftCognitiveServices class. Extends SpeechAnalyzer. Based on a tutorial by Panos Periorelles found at https://youtu.be/dRvy0a37bzg.
 */
class MicrosoftCognitiveServices extends SpeechAnalyzer {
	/**
	 * Initializes data members.
	 * 
	 * @param {string} subscriptionKey The subscription key
	 * @param {string} tokenUrl The url for having a token issued
	 * @param {string} speechAnalyzerUrl The url for performing the speech-to-text analysis
	 * @param {Object} handlers The handlers Object to be passed to the SpeechAnalyzer constructor
	 */
	constructor(subscriptionKey, tokenUrl, speechAnalyzerUrl, handlers) {
		super('Microsoft Cognitive Services', handlers);
		this.issueTokenXHR = new XHR({
			url: tokenUrl,
			headers: {
				'Ocp-Apim-Subscription-Key': subscriptionKey
			},
			onSuccess: response => this.getTextFromRecording(response),
			onError: (response, status) => {
				this._onError(response, status);
				// Call onComplete since it won't get called by speechAnalyzerXHR's onComplete
				this._onComplete(response);
			}
			// Don't set onComplete since it isn't complete until the speechAnalyzerXHR's onComplete
		});
		this.speechAnalyzerXHR = new XHR({
			url: speechAnalyzerUrl,
			onSuccess: response => {
				if (response.RecognitionStatus == 'Success') this._onSuccess(response.DisplayText);
				else this._onError(response.RecognitionStatus, 200);
			},
			onError: (response, status) => this._onError(response, status),
			onComplete: response => this._onComplete(response)
		});
	}

	/**
	 * Prepares for submitting the data for speech-to-text analysis.
	 * 
	 * @param {Object} data The relevant data
	 */
	submit(data) {
		super.submit(data);
		this.issueTokenXHR.submit();
	}

	/**
	 * Submits the data for speech-to-text analysis.
	 * 
	 * @param {string} token Token returned from request by issueTokenXHR
	 */
	getTextFromRecording(token) {
		this.speechAnalyzerXHR.updateHeader('Authorization', 'Bearer ' + token);
		this.speechAnalyzerXHR.submit(this.data.blob);
	}
}