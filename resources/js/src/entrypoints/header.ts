import Header from './Header.svelte';

const headerComponent = document.getElementById('header');

const header = headerComponent
	? new Header({
			target: headerComponent,
		})
	: null;

export default header;
