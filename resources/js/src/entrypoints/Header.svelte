<script lang="ts">
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

<header>
	<nav>
		<ul>
			<li><h1><a href="/">Afrek</a></h1></li>
		</ul>
		<ul>
			{#await $user then u}
				{#if u}
					<li><a href="/app/">Tasks</a></li>
					<li><a href="/logout" onclick={handleLogout}>Logout</a></li>
					<li>{u.email}</li>
				{:else}
					<li><a href="/app/login">Login</a></li>
					<li><a href="/app/register">Register</a></li>
				{/if}
			{/await}
		</ul>
	</nav>
</header>

<style>
	header {
		padding: 0.5rem 1rem;
		border-block-end: 1px solid var(--pico-color-violet-600);
		margin-block-end: 2rem;

		& h1 {
			margin: 0;
			padding: 0;

			& a {
				text-decoration: none;

				&:hover {
					text-decoration: underline;
				}
			}
		}
	}
</style>
