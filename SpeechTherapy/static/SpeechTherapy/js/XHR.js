class XHR {
	constructor(options) {
		Object.assign(this, options);
		if (!this.headers) this.headers = {};
		if (!this.method) this.method = 'POST';
	}

	submit(data) {
		let request = new XMLHttpRequest();
		request.open(this.method, this.url);
		request.withCredentials = this.withCredentials;
		Object.keys(this.headers).forEach(key => request.setRequestHeader(key, this.headers[key]));
		request.onreadystatechange = () => {
			if (request.readyState == 4) {
				if (request.status == 200) {
					let responseText = request.responseText;
					try {
						responseText = JSON.parse(request.responseText);
					} catch(error) {}
					if (this.onSuccess) this.onSuccess(responseText);
				}
				else if (this.onError) this.onError(request.responseText, request.status);
				if (this.onComplete) this.onComplete(request.responseText, request.status);
			}
		};
		request.send(data);
	}

	updateHeader(key, value) {
		this.headers[key] = value;
	}
}