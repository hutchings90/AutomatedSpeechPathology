class ProfileUpdater extends SpeechTherapyRequester {
	submit(attr, value) {
		let data = new FormData();
		data.append('attr', attr);
		data.append('value', value);
		super.submit(data);
	}
}