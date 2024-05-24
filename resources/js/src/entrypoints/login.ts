import Login from './Login.svelte';

const loginComponent = document.getElementById('login');

const login = loginComponent
	? new Login({
			target: loginComponent,
		})
	: null;

export default login;
