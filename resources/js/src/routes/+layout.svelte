<script lang="ts">
	import { setContext } from 'svelte';

	import { getCsrfCookie, logout } from '$lib/api/auth';
	import { clearTasks } from '$lib/api/tasks';
	import { user } from '$lib/stores/auth';

	import Link from '$lib/components/link.svelte';

	async function handleLogout(ev: MouseEvent) {
		ev.preventDefault();

		await getCsrfCookie();
		await logout();
		await clearTasks();
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
</header>

<slot></slot>

<footer>
	<div>
		<p><Link href="/blog">Blog</Link></p>
		<p><Link href="/privacy">Privacy</Link></p>
		<p><Link href="mailto:contact@afrek.app">Contact</Link></p>
	</div>

	<p>
		Developed with &lt;3 by <Link href="https://www.thorlaksson.com">Kristófer Reykjalín</Link>
	</p>
</footer>

<style>
	header {
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

	footer {
		background-color: #250048;
		color: white;
		text-align: center;
		padding: 5rem;
		margin-block-start: 5rem;
		margin-inline: 0;
	}

	/* Fonts. */

	@font-face {
		font-family: 'Atkinson Hyperlegible';
		src:
			url('/fonts/Atkinson-Hyperlegible-Regular-102a.woff2') format('woff2'),
			url('/fonts/Atkinson-Hyperlegible-Regular-102.woff') format('woff');
		font-weight: normal;
		font-style: normal;
	}
	@font-face {
		font-family: 'Atkinson Hyperlegible';
		src:
			url('/fonts/Atkinson-Hyperlegible-Bold-102a.woff2') format('woff2'),
			url('/fonts/Atkinson-Hyperlegible-Bold-102.woff') format('woff');
		font-weight: bold;
		font-style: normal;
	}
	@font-face {
		font-family: 'Atkinson Hyperlegible';
		src:
			url('/fonts/Atkinson-Hyperlegible-Italic-102a.woff2') format('woff2'),
			url('/fonts/Atkinson-Hyperlegible-Italic-102.woff') format('woff');
		font-weight: normal;
		font-style: italic;
	}
	@font-face {
		font-family: 'Atkinson Hyperlegible';
		src:
			url('/fonts/Atkinson-Hyperlegible-BoldItalic-102a.woff2') format('woff2'),
			url('/fonts/Atkinson-Hyperlegible-BoldItalic-102.woff') format('woff');
		font-weight: bold;
		font-style: italic;
	}

	@font-face {
		font-family: 'JetBrains Mono';
		src: url('/fonts/JetBrainsMono-Regular.woff2') format('woff2');
		font-weight: normal;
		font-style: normal;
	}
	@font-face {
		font-family: 'JetBrains Mono';
		src: url('/fonts/JetBrainsMono-Bold.woff2') format('woff2');
		font-weight: bold;
		font-style: normal;
	}
	@font-face {
		font-family: 'JetBrains Mono';
		src: url('/fonts/JetBrainsMono-Italic.woff2') format('woff2');
		font-weight: normal;
		font-style: italic;
	}
	@font-face {
		font-family: 'JetBrains Mono';
		src: url('/fonts/JetBrainsMono-BoldItalic.woff2') format('woff2');
		font-weight: bold;
		font-style: italic;
	}

	/* Global styles. */
	:global(body) {
		margin: 0;
	}

	:global(body, input, textarea, button) {
		font-size: 18px;
		font-family: 'Atkinson Hyperlegible', sans-serif;
	}

	:global(h1, h2, h3, h4, h5, h6) {
		font-family: Charter, serif;
	}
</style>
