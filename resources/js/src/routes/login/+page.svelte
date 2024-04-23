<script lang="ts">
	import { isAxiosError } from 'axios';
	import { goto } from '$app/navigation';
	import { getContext } from 'svelte';

	import { getCsrfCookie, login, getUser } from '$lib/api/auth';
	import PageTitle from '$lib/components/pagetitle.svelte';

	const { user } = getContext('auth');

	async function handleSubmit() {
		try {
			error = '';

			await getCsrfCookie();
			await login({ email, password, remember }, (e) => (error = e));

			$user = await getUser();
		} catch (e) {
			if (isAxiosError(e)) {
				console.log(e);
				error = e?.response?.data?.message ?? e.message;
			}
		}
	}

	$: {
		if ($user) {
			goto('/tasks');
		}
	}

	let error = '';

	let email = '';
	let password = '';
	let remember = false;
</script>

<PageTitle>Login</PageTitle>

<form on:submit|preventDefault={handleSubmit}>
	{#if error}<p>{error}</p>{/if}

	<label for="email">Email</label>
	<input
		type="email"
		name="email"
		id="email"
		placeholder="afrek@example.com"
		bind:value={email}
	/>

	<label for="password">Password</label>
	<input type="password" name="password" id="password" bind:value={password} />

	<label for="remember-me">Remember me?</label>
	<input type="checkbox" name="remember-me" id="remember-me" bind:value={remember} />

	<input type="submit" value="Login" />
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
