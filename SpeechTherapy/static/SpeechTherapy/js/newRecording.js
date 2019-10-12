Vue.component('new-recording', {
	props: [ 'processing' ],
	template: `<div></div>`,
	methods: {
		newRecording: function() {
			this.$emit('new-recording');
		}
	}
});