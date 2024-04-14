<header>
	<div>
		<p>
			<a href="/"><img width="50" src="/favicon.png" /></a>
		</p>
		<h1><a href="/">Afrek</a></h1>
	</div>

	<nav>
		<ul>
			<li><a href="/">Home</a></li>
			<li><a href="/dashboard">Dashboard</a></li>
			<li><a href="/login">Login</a></li>
			<li><a href="/register">Register</a></li>
			<li><a href="/logout">Logout</a></li>
		</ul>
	</nav>
</header>

<slot></slot>

<style>
	header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;

		padding: 0.5rem;

		& nav ul {
			display: flex;
			flex-direction: row;
			gap: 1rem;
			list-style: none;
			padding-inline-start: 0;
		}

		& div {
			display: flex;
			flex-direction: row;
			gap: 1rem;
		}
	}
</style>
