/**
 * @file
 * Provides the XHR base class.
 *
 */

/**
 * The XHR base class. This class is to be used by anything that will send XMLHttpRequests.
 */
class XHR {
	/**
	 * Initializes data members.
	 * 
	 * @param {Object} options Any options that will be used by the XHMLttpRequest
	 */
	constructor(options) {
		Object.assign(this, options);
		if (!this.headers) this.headers = {};
		if (!this.method) this.method = 'POST';
	}

	/**
	 * Creates an XMLHttpRequest and sends the data with it.
	 * 
	 * @param {mixed} data The data to be sent by the XMLHttpRequest
	 */
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

	/**
	 * Updates an XMLHttpRequest header.
	 * 
	 * @param {string} key The key of the header whose value will be updated
	 * @param {mixed} value The new value of the header
	 */
	updateHeader(key, value) {
		this.headers[key] = value;
	}
}