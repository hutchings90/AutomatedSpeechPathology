Vue.component('sign-up', {
	props: [ 'user', 'signingUp' ],
	template: `<div class='form-container'>
		<profile-form
			@submit='signUp'
			:user='user'
			:processing='signingUp'
			:submit-text='"Sign Up"'
			:show-email='true'>
		</profile-form>
		<div class='extra-links'>
			<a @click='back' class='right'>Back</a>
		</div>
	</div>`,
	methods: {
		signUp: function() {
			this.$emit('sign-up');
		},
		back: function() {
			this.$emit('back');
		}
	}
});