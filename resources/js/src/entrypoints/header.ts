import Header from './Header.svelte';
import { mount } from "svelte";

const headerComponent = document.getElementById('header');

const header = headerComponent
	? mount(Header, {
    			target: headerComponent,
    		})
	: null;

export default header;
