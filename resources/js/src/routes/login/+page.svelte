<script lang="ts">
	import { isAxiosError } from 'axios';
	import { goto } from '$app/navigation';
	import { getContext } from 'svelte';

	import { getCsrfCookie, login, getUser } from '$lib/api/auth';
	import PageTitle from '$lib/components/pagetitle.svelte';
	import Button from '$lib/components/button.svelte';

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

	<label for="email"><b>Email</b></label>
	<input
		type="email"
		name="email"
		id="email"
		placeholder="afrek@example.com"
		bind:value={email}
	/>

	<label for="password"><b>Password</b></label>
	<input type="password" name="password" id="password" bind:value={password} />

	<div>
		<label for="remember-me"><b>Remember me?</b></label>
		<input type="checkbox" name="remember-me" id="remember-me" bind:value={remember} />
	</div>

	<Button type="submit">Login</Button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 540px;
		margin: auto;
		border: 1px solid gray;
		border-radius: 0.25rem;
		padding: 5rem;

		& div {
			text-align: center;
		}

		& button {
			margin: auto;
		}
	}
</style>
