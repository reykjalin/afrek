<script lang="ts">
	import { isAxiosError } from 'axios';
	import { router } from '../lib/router';

	import { getCsrfCookie, login, getUser } from '../lib/api/auth';
	import PageTitle from '../lib/components/pagetitle.svelte';
	import { user } from '../lib/stores/auth';

	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();

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

			// Only unblock the button if we failed to log in for some reason.
			isLoggingIn = false;
		}
	}

	$effect(() => {
		$user.then((u) => {
			if (u) {
				// Redirect to task list after succesful login.
				router.route('/');
			}
		});
	});

	let error = $state('');

	let email = $state('');
	let password = $state('');
	let remember = $state(false);

	let isLoggingIn = $state(false);
</script>

<main class="container">
	<PageTitle>Login</PageTitle>

	<article>
		<form onsubmit={handleSubmit}>
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
					<input type="checkbox" name="remember-me" id="remember-me" bind:checked={remember} />
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
