<script lang="ts">
	import Link from '../lib/components/link.svelte';
	import { user } from '../lib/stores/auth';
	import { getCsrfCookie, logout } from '../lib/api/auth';
	import { tasks } from '../lib/stores/tasks';

	async function handleLogout(ev: MouseEvent) {
		ev.preventDefault();

		await getCsrfCookie();
		await logout();

		$user = undefined;
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
			{#if $user}
				<li><Link href="/tasks">Tasks</Link></li>
				<li><Link href="/logout" onClick={handleLogout}>Logout</Link></li>
				<li>{$user.email}</li>
			{:else}
				<li><Link href="/login">Login</Link></li>
				<li><Link href="/register">Register</Link></li>
			{/if}
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
