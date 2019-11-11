class UpSigner extends SpeechTherapyRequester {
	submit(user) {
		let data = new FormData();
		for (let key in user) {
			data.append(key, user[key]);
		}
		super.submit(data);
	}
}