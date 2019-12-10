class SignInHelper extends SpeechTherapyRequester {
	submit(username) {
		let data = new FormData();
		data.append('username', username);
		super.submit(data);
	}
}