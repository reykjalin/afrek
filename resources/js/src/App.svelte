<script lang="ts">
	import type { Component } from 'svelte';
	import { router } from './lib/router';

	import Header from './entrypoints/Header.svelte';
	import Tasks from './entrypoints/Tasks.svelte';
	import Login from './entrypoints/Login.svelte';
	import Register from './entrypoints/Register.svelte';

	let Route: Component | undefined = $state(undefined);

	router
		.on('/', () => {
			Route = Tasks;
		})
		.on('/login', () => {
			Route = Login;
		})
		.on('/register', () => {
			Route = Register;
		});

	router.listen();
</script>

<Header />

{#if Route}
	<Route />
{/if}
