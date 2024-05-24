import Footer from './Footer.svelte';

const footerComponent = document.getElementById('footer');

const footer = footerComponent
	? new Footer({
			target: footerComponent,
		})
	: null;

export default footer;
