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
		<Link href="/">Afrek</Link>
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
		padding: 0.5rem 1rem;

		border-block-end: 1px solid black;

		& h1 {
			margin: 0;
			padding: 0;

			& a {
				text-decoration: none;
				color: black;

				&:hover {
					text-decoration: underline;
					color: gray;
				}
			}
		}

		& nav ul {
			list-style: none;
			display: flex;
			gap: 0.5rem;
		}
	}
</style>
