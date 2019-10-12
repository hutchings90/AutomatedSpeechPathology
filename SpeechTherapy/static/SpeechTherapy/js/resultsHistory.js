Vue.component('results-history', {
	props: [ 'results' ],
	template: `<div>
		<table>
			<thead>
				<tr>
					<td>Date</td>
					<td>Text Sample</td>
					<td>Interpretation</td>
					<td>Score</td>
				</tr>
			</thead>
			<tbody>
				<tr v-if='!resultsFound'>
					<td>No results.</td>
					<td colspan='3'>Make a recording to view results</td>
				</tr>
				<tr v-for='result in results'>
					<td v-html='results.date'></td>
					<td v-html='results.textSample'></td>
					<td v-html='results.interpretation'></td>
					<td v-html='results.score'></td>
				</tr>
			</tbody>
		</table>
	</div>`,
	computed: {
		resultsFound: function() {
			return this.results.length > 0;
		}
	}
});