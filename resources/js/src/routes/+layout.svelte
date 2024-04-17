<script lang="ts">
	import axios from '$lib/axios';
	import { goto } from '$app/navigation';

	async function logout() {
		await axios.get('/sanctum/csrf-cookie');
		await axios.post('/logout', {});
		goto('/login');
	}
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
			<li><a href="/login">Login</a></li>
			<li><a href="/register">Register</a></li>
			<li><a href="/logout" on:click|preventDefault={logout}>Logout</a></li>
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
