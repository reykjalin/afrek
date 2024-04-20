<script lang="ts">
	import { setContext } from 'svelte';
	import { getCsrfCookie, logout } from '$lib/api';
	import { user } from '$lib/stores/auth';

	async function handleLogout() {
		await getCsrfCookie();
		await logout();
		$user = undefined;
	}

	export let data;
	$: $user = data.user;

	setContext('auth', {
		user,
	});
</script>

<header>
	<h1>
		<img width="50" src="/favicon.png" alt="The afrek logo showing a calendar." /><a href="/"
			>Afrek</a
		>
	</h1>
	<nav>
		<ul>
			<li><a href="/">Home</a></li>
			{#if $user}
				<li><a href="/tasks">Tasks</a></li>
				<li><a href="/logout" on:click|preventDefault={handleLogout}>Logout</a></li>
				<li>{$user.email}</li>
			{:else}
				<li><a href="/login">Login</a></li>
				<li><a href="/register">Register</a></li>
			{/if}
		</ul>
	</nav>
</header>

<slot></slot>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;

		& nav ul {
			list-style: none;
			display: flex;
			gap: 0.5rem;
		}
	}
</style>
