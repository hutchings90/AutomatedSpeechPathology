Vue.component('sign-in', {
	props: [ 'user', 'signingIn' ],
	template: `<div class='form-container'>
		<profile-form
			@submit='signIn'
			:user='user'
			:processing='signingIn'
			:submit-text='"Sign In"'>
		</profile-form>
		<div class='extra-links'>
			<a @click='helpSigningIn' class='left'>Need help signing in?</a>
			<a @click='signUp' class='right'>Sign up</a>
		</div>
	</div>`,
	methods: {
		signIn: function() {
			this.$emit('sign-in');
		},
		signUp: function() {
			this.$emit('sign-up');
		},
		helpSigningIn: function() {
			this.$emit('help-signing-in');
		}
	}
});