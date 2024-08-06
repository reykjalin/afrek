<script lang="ts">
	import { isAxiosError } from 'axios';

	import { getCsrfCookie, login, getUser } from '../lib/api/auth';
	import PageTitle from '../lib/components/pagetitle.svelte';
	import { user } from '../lib/stores/auth';

	async function handleSubmit() {
		try {
			error = '';
			isLoggingIn = true;

			await getCsrfCookie();
			await login({ email, password, remember }, (e) => (error = e));

			$user = getUser();
		} catch (e) {
			if (isAxiosError(e)) {
				console.log(e);
				error = e?.response?.data?.message ?? e.message;
			}
		}

		isLoggingIn = false;
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
	let remember = false;

	let isLoggingIn = false;
</script>

<main class="container">
	<PageTitle>Login</PageTitle>

	<article>
		<form on:submit|preventDefault={handleSubmit}>
			{#if error}<p>{error}</p>{/if}

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

				<label for="remember-me"
					>Remember me?
					<input
						type="checkbox"
						name="remember-me"
						id="remember-me"
						bind:value={remember}
					/>
				</label>
			</fieldset>

			<button type="submit" disabled={isLoggingIn}>Login</button>
		</form>
	</article>
</main>

<style>
	article {
		border: 1px solid var(--pico-color-violet-600);
	}
</style>
