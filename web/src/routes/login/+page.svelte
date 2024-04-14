<form>
	<div>
		<label for="email">Email</label>
		<input id="email" type="email" name="email" placeholder="afrek@example.com" />
	</div>

	<div>
		<label for="password">Password</label>
		<input id="password" type="password" name="password" />
	</div>

	<div>
		<input type="submit" value="Login" />
	</div>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
