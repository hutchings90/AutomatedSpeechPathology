/**
 * @file
 * Provides the RecordingUploader wrapper class.
 *
 */

/**
 * The RecordingUploader wrapper class. Extends SpeechTherapyRequester.
 */
class RecordingUploader extends SpeechTherapyRequester {
	/**
	 * Submits data to be used to create a Recording record.
	 * 
	 * @param {number} newRecordingResultsIndex The index of the SpeechAnalyzer within an instance
	 *   of NewRecordingInterpreter
	 * @param {number} recordingsPerPage The number of Recordings per page
	 * @param {number} ts When this request was started
	 * @param {mixed} data The data to be used to create a Recording record
	 */
	submit(newRecordingResultsIndex, recordingsPerPage, ts, data) {
		let blob = data.blob;
		let formData = new FormData();
		formData.append('newRecordingResultsIndex', newRecordingResultsIndex);
		formData.append('recordingsPerPage', recordingsPerPage);
		formData.append('audio', blob, blob.filename);
		formData.append('text_sample_id', data.text_sample_id);
		formData.append('interpretation', data.interpretation);
		formData.append('ts', ts);
		super.submit(formData);
	}
}