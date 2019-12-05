Vue.component('reports', {
	props: [ 'reports' ],
	template: `<div class='reports'>
		<report
			v-for='(report, i) in reports'
			:key='i'
			:report='report'></report>
	</div>`
});