<script lang="ts">
	import PageTitle from '$lib/components/pagetitle.svelte';
</script>

<main>
	<PageTitle>Blog</PageTitle>
</main>

<style>
	main {
		padding: 1rem;
		background-color: white;
	}

	@media (min-width: 760px) {
		main {
			padding: 5rem;
		}
	}

	@media (min-width: 1200px) {
		main {
			padding: 5rem 10rem;
		}
	}
</style>
