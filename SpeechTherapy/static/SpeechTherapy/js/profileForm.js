Vue.component('profile-form', {
	props: [ 'user', 'processing', 'submitText', 'action', 'showEmail', 'leftExtra', 'rightExtra' ],
	template: `<div>
		<form @submit='submit($event)' :action='action' method='POST'>
			<div>
				<label>Username <span class='required'>*</span></label>
				<br>
				<input name='username' v-model.lazy='user.username' @change='updateAttr("username")' type='username' autofocus/>
			</div>
			<div>
				<label>Password <span class='required'>*</span></label>
				<br>
				<input name='password' v-model.lazy='user.password' @change='updateAttr("password")' type='password'/>
			</div>
			<div v-if='showEmail'>
				<label>Email</label>
				<br>
				<input name='email' v-model.lazy='user.email' @change='updateAttr("email")' type='email'/>
			</div>
			<button v-if='submitText' v-html='submitText' :disabled='processing'></button>
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
			this.$emit('submit', e);
		},
		leftExtraClicked: function() {
			this.$emit('left-extra-clicked');
		},
		rightExtraClicked: function() {
			this.$emit('right-extra-clicked');
		}
	}
});