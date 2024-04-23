<script lang="ts">
	import { goto } from '$app/navigation';
	import { getContext } from 'svelte';
	import { getCsrfCookie, getUser, register } from '$lib/api/auth';

	const { user } = getContext('auth');

	async function handleSubmit() {
		error = '';

		if (password.length < 8) {
			error = 'The password must be at least 8 characters';
			return;
		} else if (password !== confirmPassword) {
			error = 'The password field confirmation does not match.';
			return;
		}

		await getCsrfCookie();
		await register(
			{ email, password, password_confirmation: confirmPassword },
			(e) => (error = e),
		);

		$user = await getUser();
	}

	$: {
		if ($user) {
			goto('/tasks');
		}
	}

	let error = '';

	let email = '';
	let password = '';
	let confirmPassword = '';
</script>

<h2>Register</h2>

<form on:submit|preventDefault={handleSubmit}>
	{#if error}<p class="error">{error}</p>{/if}

	<input
		type="email"
		name="email"
		id="email"
		placeholder="afrek@example.com"
		bind:value={email}
	/>
	<input type="password" name="password" id="password" bind:value={password} />
	<input
		type="password"
		name="confirm_password"
		id="confirm_password"
		bind:value={confirmPassword}
	/>
	<input type="submit" value="Register" />
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		& .error {
			color: red;
		}
	}
</style>
