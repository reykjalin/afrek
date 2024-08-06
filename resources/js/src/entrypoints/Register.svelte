<script lang="ts">
	import { getCsrfCookie, getUser, register } from '../lib/api/auth';
	import PageTitle from '../lib/components/pagetitle.svelte';

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

<main class="container">
	<PageTitle>Register</PageTitle>

	<article>
		<form on:submit|preventDefault={handleSubmit}>
			{#if error}<p class="error">{error}</p>{/if}

			<fieldset>
				<label for="email"
					>Email
					<input
						type="email"
						name="email"
						id="email"
						placeholder="afrek@example.com"
						bind:value={email}
					/>
				</label>

				<label for="password"
					>Password
					<input type="password" name="password" id="password" bind:value={password} />
				</label>

				<label for="confirm_password"
					>Confirm password
					<input
						type="password"
						name="confirm_password"
						id="confirm_password"
						bind:value={confirmPassword}
					/>
				</label>
			</fieldset>

			<button type="submit">Register</button>
		</form>
	</article>
</main>

<style>
	article {
		border: 1px solid var(--pico-color-violet-600);
	}

	form {
		& .error {
			color: red;
		}
	}
</style>
