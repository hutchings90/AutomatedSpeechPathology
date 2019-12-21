/**
 * @file
 * Provides the SignInHelper wrapper class.
 *
 */

/**
 * The SignInHelper wrapper class. Extends SpeechTherapyRequester.
 */
class SignInHelper extends SpeechTherapyRequester {
	/**
	 * Submits data to be used to help a User sign in.
	 * 
	 * @param {string} username The username of the User who needs help signing in
	 */
	submit(username) {
		let data = new FormData();
		data.append('username', username);
		super.submit(data);
	}
}