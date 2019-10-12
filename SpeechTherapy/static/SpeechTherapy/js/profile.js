Vue.component('profile', {
	props: [ 'user', 'signingOut' ],
	template: `<div class='form-container'>
		<profile-form
			@update-attr='updateAttr'
			@submit-button-clicked='signOut'
			:user='user'
			:processing='signingOut'
			:show-email='true'>
		</profile-form>
		<div class='extra-links'>
			<a @click='signOut' class='right'>Sign Out</a>
		</div>
	</div>`,
	methods: {
		updateAttr: function(attr) {
			this.$emit('update-attr', attr);
		},
		signOut: function() {
			this.$emit('sign-out');
		}
	}
});