Vue.component('text-search', {
	props: [ 'textSamples', 'searching' ],
	template: `<div class='text-search'>
		<div class='content'>
			<div class='header'>
				<h3>Search Phrases</h3>
			</div>
			<div class='body'>
				<div>
					Search: <input v-model='input' @input='handleInput' ref='search-input' type='text'/><span v-show='searching'> Searching...</span>
				</div>
				<p v-html='report'></p>
				<div v-for='textSample in textSamples' class='input'>
					<label class='input'>
						<input v-model='selectedTextSampleIds' :value='textSample.id' type='checkbox'/><span v-html='textSample.text'></span>
					</label>
				</div>
			</div>
			<div class='footer'>
				<button v-show='hasTextSamples' v-html='toggleAllText' @click='toggleAll' class='left'></button>
				<button :disabled='!hasSelections' @click='selectTextSamples'>Select</button>
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
			selectedTextSampleIds: []
		};
	},
	computed: {
		toggleAllText: function() { return (this.selectAll ? 'Unselect' : 'Select') + ' All'; },
		searchInput: function() { return this.$refs['search-input']; },
		isValidInput: function() { return this.input.length > 4; },
		hasTextSamples: function() { return this.textSamples.length > 0; },
		hasSelections: function() { return this.selectedTextSamples.length > 0; },
		keyedTextSamples: function() {
			return this.textSamples.reduce((textSamples, textSample) => {
				textSamples[textSample.id] = textSample;
				return textSamples;
			}, {});
		},
		selectedTextSamples: function() { return this.selectedTextSampleIds.map(id => this.keyedTextSamples[id]); },
		report: function() {
			if (this.hasTextSamples || this.searching) return '';
			if (this.isValidInput) return 'No matching phrases found.';
			return 'Type at least 5 characters to search for phrases.';
		},
		textSampleIds: function() { return this.textSamples.map(textSample => textSample.id); },
		selectAll: {
			get: function() { return this.selectedTextSampleIds.length == this.textSampleIds.length; },
			set: function() {
				this.selectedTextSampleIds = this.selectAll ? [] : this.textSampleIds;
			}
		}
	},
	watch: {
		textSamples: function() {
			this.selectedTextSampleIds = this.selectedTextSampleIds.filter(id => this.keyedTextSamples[id]);
		}
	},
	methods: {
		handleInput: function() {
			if (this.isValidInput) this.$emit('search', this.input);
		},
		close: function() {
			this.$emit('close');
			this.selectedTextSampleIds = [];
		},
		selectTextSamples: function() {
			this.$emit('select-text-samples', this.selectedTextSamples);
			this.close();
		},
		toggleAll: function() {
			this.selectAll = !this.selectAll;
		}
	}
});