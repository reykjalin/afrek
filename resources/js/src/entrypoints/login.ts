import Login from './Login.svelte';
import { mount } from "svelte";

const loginComponent = document.getElementById('login');

if (loginComponent) {
	mount(Login, {
    		target: loginComponent,
    	});
}
