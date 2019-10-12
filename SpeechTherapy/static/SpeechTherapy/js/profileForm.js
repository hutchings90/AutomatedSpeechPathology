Vue.component('profile-form', {
	props: [ 'user', 'processing', 'submitText', 'showEmail', 'leftExtra', 'rightExtra', 'preventSubmission' ],
	template: `<div class='form-container'>
		<form @submit='submit($event)'>
			<div>
				<label>Username <span class='required'>*</span></label>
				<br>
				<input v-model.lazy='user.username' @change='updateAttr("username")' :disabled='processing' type='username' autofocus/>
			</div>
			<div>
				<label>Password <span class='required'>*</span></label>
				<br>
				<input v-model.lazy='user.password' @change='updateAttr("password")' :disabled='processing' type='password'/>
			</div>
			<div v-if='showEmail'>
				<label>Email</label>
				<br>
				<input v-model.lazy='user.email' @change='updateAttr("email")' :disabled='processing' type='email'/>
			</div>
			<button v-if='submitText' v-html='submitText' @click='submitButtonClicked' :disabled='processing'></button>
		</form>
		<div v-if='leftExtra || rightExtra' class='extra-links'>
			<a v-if='leftExtra' v-html='leftExtra' @click='leftExtraClicked' class='left'></a>
			<a v-if='rightExtra' v-html='rightExtra' @click='rightExtraClicked' class='right'></a>
		</div>
	</div>`,
	methods: {
		updateAttr: function(attr) {
			this.$emit('update-attr', attr);
		},
		submit: function(e) {
			if (this.preventSubmission) e.preventDefault();

			this.$emit('submit', e);
		},
		submitButtonClicked: function() {
			this.$emit('submit-button-clicked');
		},
		leftExtraClicked: function() {
			this.$emit('left-extra-clicked');
		},
		rightExtraClicked: function() {
			this.$emit('right-extra-clicked');
		}
	}
});