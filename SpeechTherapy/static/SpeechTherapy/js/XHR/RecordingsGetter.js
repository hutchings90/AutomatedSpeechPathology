/**
 * @file
 * Provides the RecordingsGetter wrapper class.
 *
 */

/**
 * The RecordingsGetter wrapper class. Extends SpeechTherapyRequester.
 */
class RecordingsGetter extends SpeechTherapyRequester {
	/**
	 * Gets Recording records.
	 * 
	 * @param {number} page The page number of the desired Recordings
	 * @param {int} recordingsPerPage The number of Recordings per page
	 * @param {number} pageNumberAfterGetRecordings The page that should be displayed after
	 *   retrieving the Recordings
	 * @param {number} ts When this request was started
	 */
	submit(page, recordingsPerPage, pageNumberAfterGetRecordings, ts) {
		let data = new FormData();
		data.append('page', page);
		data.append('recordingsPerPage', recordingsPerPage);
		data.append('pageNumberAfterGetRecordings', pageNumberAfterGetRecordings);
		data.append('ts', ts);
		super.submit(data);
	}
}