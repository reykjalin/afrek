<script lang="ts">
	export let href = '';
	export let onClick: ((ev: MouseEvent) => void) | undefined = undefined;
</script>

<a {href} on:click={onClick}>
	<slot></slot>
</a>

<style>
	a {
		color: #4263eb;

		&:hover {
			color: #5c7cfa;
			text-decoration: none;
		}

		&:visited {
			color: #be4bdb;
		}
	}
</style>
