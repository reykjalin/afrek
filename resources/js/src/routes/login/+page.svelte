<script lang="ts">
	import axios from '$lib/axios';
	import { isAxiosError } from 'axios';
	import { goto } from '$app/navigation';

	async function handleSubmit() {
		try {
			error = '';

			await axios.get('/sanctum/csrf-cookie');
			await axios.post('/login', {
				email,
				password,
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

	let error: string;

	let email: string;
	let password: string;
</script>

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
	<input type="submit" value="Login" />
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
