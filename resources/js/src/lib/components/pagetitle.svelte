<script>
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();
</script>

<h2>{@render children?.()}</h2>

<style>
	h2 {
		text-align: center;
	}
</style>
