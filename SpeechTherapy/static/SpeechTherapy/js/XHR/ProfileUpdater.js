/**
 * @file
 * Provides the ProfileUpdater wrapper class.
 *
 */

/**
 * The ProfileUpdater wrapper class. Extends SpeechTherapyRequester.
 */
class ProfileUpdater extends SpeechTherapyRequester {
	/**
	 * Updates a User record.
	 * 
	 * @param {string} attr The name of the user field to be updated
	 * @param {mixed} value The new value of the user field
	 */
	submit(attr, value) {
		let data = new FormData();
		data.append('attr', attr);
		data.append('value', value);
		super.submit(data);
	}
}