/**
 * @file
 * Provides the NewTextSamplesGetter wrapper class.
 *
 */

/**
 * The NewTextSamplesGetter wrapper class. Extends SpeechTherapyRequester.
 */
class NewTextSamplesGetter extends SpeechTherapyRequester {
	/**
	 * Gets TextSample records.
	 * 
	 * @param {number} id The highest id of currently loaded TextSample records
	 * @param {number} ts When this request was started
	 */
	submit(id, ts) {
		let data = new FormData();
		data.append('id', id);
		data.append('ts', ts);
		super.submit(data);
	}
}