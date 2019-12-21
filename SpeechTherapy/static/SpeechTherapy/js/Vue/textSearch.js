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
	mounted() {
		this.searchInput.focus();
	},
	data() {
		return {
			input: '',
			selectedTextSampleIds: []
		};
	},
	computed: {
		toggleAllText() { return (this.selectAll ? 'Unselect' : 'Select') + ' All'; },
		searchInput() { return this.$refs['search-input']; },
		isValidInput() { return this.input.length > 4; },
		hasTextSamples() { return this.textSamples.length > 0; },
		hasSelections() { return this.selectedTextSamples.length > 0; },
		keyedTextSamples() {
			return this.textSamples.reduce((textSamples, textSample) => {
				textSamples[textSample.id] = textSample;
				return textSamples;
			}, {});
		},
		selectedTextSamples() { return this.selectedTextSampleIds.map(id => this.keyedTextSamples[id]); },
		report() {
			if (this.hasTextSamples || this.searching) return '';
			if (this.isValidInput) return 'No matching phrases found.';
			return 'Type at least 5 characters to search for phrases.';
		},
		textSampleIds() { return this.textSamples.map(textSample => textSample.id); },
		selectAll: {
			get() { return this.selectedTextSampleIds.length == this.textSampleIds.length; },
			set() {
				this.selectedTextSampleIds = this.selectAll ? [] : this.textSampleIds;
			}
		}
	},
	watch: {
		textSamples() {
			this.selectedTextSampleIds = this.selectedTextSampleIds.filter(id => this.keyedTextSamples[id]);
		}
	},
	methods: {
		handleInput() {
			if (this.isValidInput) this.$emit('search', this.input);
		},
		close() {
			this.$emit('close');
			this.selectedTextSampleIds = [];
		},
		selectTextSamples() {
			this.$emit('select-text-samples', this.selectedTextSamples);
			this.close();
		},
		toggleAll() {
			this.selectAll = !this.selectAll;
		}
	}
});