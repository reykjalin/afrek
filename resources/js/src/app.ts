import { mount } from 'svelte';
import App from './App.svelte';

const appComponent = document.getElementById('app');

if (appComponent) {
	mount(App, { target: appComponent });
}
