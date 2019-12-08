Vue.component('text-search', {
	props: [ 'textSamples', 'searching' ],
	template: `<div class='text-search'>
		<div class='content'>
			<div class='header'>
				<h3>Search Phrases<button @click='close' class='close-button'>X</button></h3>
			</div>
			<div class='body'>
				<div>
					Search: <input v-model='input' @input='handleInput' ref='search-input' type='text'/>
				</div>
				<p v-html='report'></p>
				<div v-show='hasTextSamples' class='input'>
					<label class='input'>
						<input v-model='selectAll' type='checkbox'/>Select All
					</label>
				</div>
				<div v-for='textSample in textSamples' class='input'>
					<label class='input'>
						<input v-model='selectedTextSampleIds' :value='textSample.id' type='checkbox'/><span v-html='textSample.text'></span>
					</label>
				</div>
			</div>
			<div class='footer'>
				<button v-show='hasTextSamples' @click='selectTextSamples'>Select</button>
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
			textSampleIdsSelected: [],
			allSelected: false
		};
	},
	computed: {
		searchInput: function() { return this.$refs['search-input']; },
		isValidInput: function() { return this.input.length > 4; },
		hasTextSamples: function() { return this.textSamples.length > 0; },
		keyedTextSamples: function() {
			return this.textSamples.reduce((textSamples, textSample) => {
				textSamples[textSample.id] = textSample;
				return textSamples;
			}, {});
		},
		selectedTextSamples: function() { return this.selectedTextSampleIds.map(id => this.keyedTextSamples[id]); },
		report: function() {
			if (this.hasTextSamples) return '';
			if (this.searching) return 'Searching...';
			if (this.isValidInput) return 'No matching phrases found.';
			return 'Type at least 5 characters for results to appear.';
		},
		textSampleIds: function() { return this.textSamples.map(textSample => textSample.id); },
		selectAll: {
			get: function() {
				return this.allSelected;
			},
			set: function(allSelected) {
				if (this.allSelected) {
					this.selectedTextSampleIds = [];
					this.allSelected = false;
				}
				else {
					this.selectedTextSampleIds = this.textSampleIds;
					this.allSelected = true;
				}
			}
		},
		selectedTextSampleIds: {
			get: function() {
				return this.textSampleIdsSelected;
			},
			set: function(textSampleIds) {
				this.textSampleIdsSelected = textSampleIds;
				this.allSelected = this.textSampleIdsSelected.length == this.textSampleIds.length;
			}
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
		}
	}
});