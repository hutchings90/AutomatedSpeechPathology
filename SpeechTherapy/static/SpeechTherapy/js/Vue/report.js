Vue.component('report', {
	props: [ 'report' ],
	template: `<div :class='containerClassObject'>
		<div v-html='report.value' :class='reportClassObject'></div>
	</div>`,
	computed: {
		containerClassObject: function() {
			return {
				'report-container': true,
				'hide': this.report.done,
			};
		},
		reportClassObject: function() {
			let classObject = { report: true };
			classObject[this.report.type] = true;
			return classObject;
		}
	}
});