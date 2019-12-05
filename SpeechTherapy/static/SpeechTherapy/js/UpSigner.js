class UpSigner extends SpeechTherapyRequester {
	submit(user) {
		let data = new FormData();
		Object.keys(user).forEach(key => data.append(key, user[key]));
		super.submit(data);
	}
}