/**
 * @file
 * Provides the InSigner wrapper class.
 *
 */

/**
 * The InSigner wrapper class. Extends SpeechTherapyRequester.
 */
class InSigner extends SpeechTherapyRequester {
	/**
	 * Submits data to be used to sign a User in.
	 * 
	 * @param {string} username Username of User to be signed in
	 * @param {string} password Password of User to be signed in
	 */
	submit(username, password) {
		let data = new FormData();
		data.append('username', username);
		data.append('password', password);
		super.submit(data);
	}
}