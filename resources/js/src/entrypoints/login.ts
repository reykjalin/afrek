import Login from './Login.svelte';

const loginComponent = document.getElementById('login');

if (loginComponent) {
	new Login({
		target: loginComponent,
	});
}
