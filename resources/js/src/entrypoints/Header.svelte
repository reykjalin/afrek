<script lang="ts">
	import Link from '../lib/components/link.svelte';
	import { user } from '../lib/stores/auth';
	import { getCsrfCookie, logout } from '../lib/api/auth';
	import { tasks } from '../lib/stores/tasks';

	async function handleLogout(ev: MouseEvent) {
		ev.preventDefault();

		await getCsrfCookie();
		await logout();

		$user = new Promise((resolve) => resolve(undefined));
		$tasks = [];
	}
</script>

<div class="header">
	<h1>
		<Link href="/"
			><img width="150" src="/logo.png" alt="The afrek logo showing a calendar." /></Link
		>
	</h1>
	<nav>
		<ul>
			{#await $user then u}
				{#if u}
					<li><Link href="/tasks">Tasks</Link></li>
					<li><Link href="/logout" onClick={handleLogout}>Logout</Link></li>
					<li>{u.email}</li>
				{:else}
					<li><Link href="/login">Login</Link></li>
					<li><Link href="/register">Register</Link></li>
				{/if}
			{/await}
		</ul>
	</nav>
</div>

<style>
	div.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 1rem;

		& nav ul {
			list-style: none;
			display: flex;
			gap: 0.5rem;
		}
	}
</style>
