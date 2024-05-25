import Register from './Register.svelte';

const registerComponent = document.getElementById('register');

const register = registerComponent
	? new Register({
			target: registerComponent,
		})
	: null;

export default register;
