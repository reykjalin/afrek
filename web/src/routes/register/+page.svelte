<script>
	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('./$types').ActionData} */
	export let form;
</script>

<form method="POST">
	{#if form?.message}<p class="error">{form.message}</p>{/if}
	{#if form?.success}<p class="success">Successfully registered!</p>{/if}

	<div>
		<label for="email">Email</label>
		<input id="email" type="email" name="email" placeholder="afrek@example.com" />
	</div>

	<div>
		<label for="password">Password</label>
		<input id="password" type="password" name="password" />
	</div>

	<div>
		<label for="confirm-password">Confirm password</label>
		<input id="confirm-password" type="password" name="confirm-password" />
	</div>

	<div>
		<input type="submit" value="Register" />
	</div>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		& .error {
			color: red;
		}
		& .success {
			color: green;
		}
	}
</style>
