/**
 * @file
 * Provides the TextSamplesSearcher wrapper class.
 *
 */

/**
 * The TextSamplesSearcher wrapper class. Extends SpeechTherapyRequester.
 */
class TextSamplesSearcher extends SpeechTherapyRequester {
	/**
	 * Submits data to be used to search for TextSamples.
	 * 
	 * @param {string} text The text to be used to search for matching TextSamples
	 * @param {number} ts When this request was started
	 */
	submit(text, ts) {
		let data = new FormData();
		data.append('text', text);
		data.append('ts', ts);
		super.submit(data);
	}
}