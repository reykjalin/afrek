import Footer from './Footer.svelte';
import { mount } from "svelte";

const footerComponent = document.getElementById('footer');

const footer = footerComponent
	? mount(Footer, {
    			target: footerComponent,
    		})
	: null;

export default footer;
