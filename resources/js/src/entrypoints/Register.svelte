<script lang="ts">
	import { getCsrfCookie, getUser, register } from '../lib/api/auth';
	import PageTitle from '../lib/components/pagetitle.svelte';
	import Button from '../lib/components/button.svelte';

	import { user } from '../lib/stores/auth';

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

		$user = getUser();
	}

	$: {
		$user.then((u) => {
			if (u) {
				window.location.href = '/tasks';
			}
		});
	}

	let error = '';

	let email = '';
	let password = '';
	let confirmPassword = '';
</script>

<main>
	<PageTitle>Register</PageTitle>

	<form on:submit|preventDefault={handleSubmit}>
		{#if error}<p class="error">{error}</p>{/if}

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

		<label for="confirm_password"><b>Confirm password</b></label>
		<input
			type="password"
			name="confirm_password"
			id="confirm_password"
			bind:value={confirmPassword}
		/>

		<Button type="submit">Register</Button>
	</form>
</main>

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

		background-color: white;

		& .error {
			color: red;
		}

		& button {
			margin: auto;
		}
	}
</style>
