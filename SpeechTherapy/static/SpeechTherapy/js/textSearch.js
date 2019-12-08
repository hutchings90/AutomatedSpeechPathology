Vue.component('text-search', {
	props: [ 'textSamples' ],
	template: `<div class='text-search'>
		<div class='content'>
			<div class='header'>
				<h3>Search Phrases<span @click='close' class='close-button'>X</span></h3>
			</div>
			<div class='body'>
				<div>
					Search: <input v-model='input' @input='handleInput' ref='search-input' type='text'/>
				</div>
				<label v-for='textSample in textSamples'>
					<input v-model='selectedTextSamples' :value='textSample.id' type='checkbox'/><span v-html='textSample.text'></span>
				</label>
			</div>
			<div class='footer'>
				<button v-show='textSamples.length > 0' @click='selectTextSamples'>Select</button>
				<button @click='close'>Cancel</button>
			</div>
		</div>
	</div>`,
	mounted: function() {
		this.searchInput.focus();
	},
	data: function() {
		return {
			input: '',
			selectedTextSamples: []
		};
	},
	computed: {
		searchInput: function() { return this.$refs['search-input']; }
	},
	methods: {
		handleInput: function() {
			if (this.input.length > 4) this.$emit('search', this.input);
		},
		close: function() {
			this.$emit('close');
			this.selectedTextSamples = [];
		},
		selectTextSamples: function() {
			this.$emit('select-text-samples', this.selectedTextSamples);
			this.close();
		}
	}
});