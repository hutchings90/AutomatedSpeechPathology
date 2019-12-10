Vue.component('profile-form', {
	props: [ 'user', 'processing', 'submitText', 'showPassword', 'showEmail', 'leftExtra', 'rightExtra', 'notes' ],
	template: `<div>
		<form @submit.prevent='submit($event)' method='POST'>
			<div>
				<label>Username <span class='required'>*</span></label>
				<br>
				<input name='username' v-model.lazy='user.username' @change='updateAttr("username")' type='username' autofocus/>
			</div>
			<div v-if='showPassword'>
				<label>Password <span class='required'>*</span></label>
				<br>
				<input name='password' v-model.lazy='user.password' @change='updateAttr("password")' type='password'/>
			</div>
			<div v-if='showEmail'>
				<label>Email <span class='required'>*</span></label>
				<br>
				<input name='email' v-model.lazy='user.email' @change='updateAttr("email")' type='email'/>
			</div>
			<button v-if='submitText' v-html='submitText' :disabled='processing'></button>
		</form>
		<div v-if='leftExtra || rightExtra' class='extra-links'>
			<a v-if='leftExtra' v-html='leftExtra' @click='leftExtraClicked' class='left'></a>
			<a v-if='rightExtra' v-html='rightExtra' @click='rightExtraClicked' class='right'></a>
		</div>
		<p class='profile-form-notes' v-html='notes'></p>
	</div>`,
	methods: {
		updateAttr: function(attr) {
			this.$emit('update-attr', attr);
		},
		submit: function(e) {
			this.$emit('submit', e);
			return false;
		},
		leftExtraClicked: function() {
			this.$emit('left-extra-clicked');
		},
		rightExtraClicked: function() {
			this.$emit('right-extra-clicked');
		}
	}
});