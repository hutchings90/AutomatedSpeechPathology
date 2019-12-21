Vue.component('report', {
	props: [ 'report' ],
	template: `<div :class='containerClassObject'>
		<div v-html='report.value' :class='reportClassObject'></div>
	</div>`,
	computed: {
		containerClassObject() {
			return {
				'report-container': true,
				'hide': this.report.done,
			};
		},
		reportClassObject() {
			let classObject = { report: true };
			classObject[this.report.type] = true;
			return classObject;
		}
	}
});