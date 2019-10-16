Vue.component('recording', {
	props: [ 'recording' ],
	template: `<tr>
		<td v-html='recording.name'></td>
		<td v-html='recording.text_sample'></td>
		<td v-html='recording.interpretation'></td>
		<td v-html='recording.score'></td>
	</tr>`,
});

Vue.component('recordings', {
	props: [ 'recordings' ],
	template: `<div>
		<table>
			<thead>
				<tr>
					<td>Name</td>
					<td>Text Sample</td>
					<td>Interpretation</td>
					<td>Score</td>
				</tr>
			</thead>
			<tbody>
				<tr v-if='!recordingsFound'>
					<td>No recordings.</td>
					<td colspan='3'>Make a recording to view recordings</td>
				</tr>
				<recording
					v-for='recording in recordings'
					:key='recording.id'
					:recording='recording'></recording>
			</tbody>
		</table>
	</div>`,
	computed: {
		recordingsFound: function() { return this.recordings.length > 0; },
	}
});