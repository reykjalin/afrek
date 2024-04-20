<script lang="ts">
	import axios from '$lib/axios';
	import { isAxiosError } from 'axios';
	import { goto } from '$app/navigation';

	async function handleSubmit() {
		try {
			await axios.get('/sanctum/csrf-cookie');

			error = '';
			await axios.post('/register', {
				email,
				password,
				password_confirmation: confirmPassword,
			});

			const user = await axios.get('/api/user');
			console.log(user);

			goto('/');
		} catch (e) {
			if (isAxiosError(e)) {
				console.log(e);
				error = e?.response?.data?.message ?? e.message;
			}
		}
	}

	let error = '';

	let email = '';
	let password = '';
	let confirmPassword = '';
</script>

<h2>Register</h2>

<form on:submit|preventDefault={handleSubmit}>
	{#if error}<p>{error}</p>{/if}

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
	}
</style>
