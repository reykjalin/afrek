import Register from './Register.svelte';
import { mount } from "svelte";

const registerComponent = document.getElementById('register');

const register = registerComponent
	? mount(Register, {
    			target: registerComponent,
    		})
	: null;

export default register;
