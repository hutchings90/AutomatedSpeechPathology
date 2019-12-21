/**
 * @file
 * Provides the UpSigner wrapper class.
 *
 */

/**
 * The UpSigner wrapper class. Extends SpeechTherapyRequester.
 */
class UpSigner extends SpeechTherapyRequester {
	/**
	 * Submits data to be used to create a User record.
	 * 
	 * @param {Object} user The data to be used to create a user record
	 */
	submit(user) {
		let data = new FormData();
		Object.keys(user).forEach(key => data.append(key, user[key]));
		super.submit(data);
	}
}