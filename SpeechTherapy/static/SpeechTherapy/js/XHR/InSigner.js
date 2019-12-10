class InSigner extends SpeechTherapyRequester {
	submit(username, password) {
		let data = new FormData();
		data.append('username', username);
		data.append('password', password);
		super.submit(data);
	}
}