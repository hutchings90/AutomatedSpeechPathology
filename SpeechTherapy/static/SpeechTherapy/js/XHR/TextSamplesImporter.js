/**
 * @file
 * Provides the TextSamplesImporter wrapper class.
 *
 */

/**
 * The TextSamplesImporter wrapper class. Extends SpeechTherapyRequester.
 */
class TextSamplesImporter extends SpeechTherapyRequester {
	/**
	 * Submits data to be used to create TextSample records.
	 * 
	 * @param {number} ts When this request was started
	 * @param {object} file The file to be used to create TextSample records. This should be a .zip
	 *   file where each of its files is a text file with a single line to be used as the text
	 *   field of a TextSample record.
	 */
	submit(ts, file) {
		let data = new FormData();
		data.append('ts', ts);
		data.append('textSamples', file);
		super.submit(data);
	}
}