Vue.component('admin-form', {
	props: [ 'importingTextSamples' ],
	template: `<div>
		<form>
			<div>
				<label>Text Samples</label>
				<br>
				<input :disabled='importingTextSamples' @change='importTextSamples($event)' type='file' accept='application/zip'/>
			</div>
		</form>
	</div>`,
	methods: {
		importTextSamples: function(ev) {
			this.$emit('import-text-samples', ev.target.files[0]);
		}
	}
});