<script lang="ts">
	export let onClick: (() => void) | null = null;

	function handleClick(_ev: MouseEvent) {
		if (onClick) {
			onClick();
		}
	}
</script>

{#if onClick}
	<button class="pill" on:click={handleClick}><slot></slot></button>
{:else}
	<span class="pill"><slot></slot></span>
{/if}

<style>
	.pill {
		padding: 0.25rem;
		border-radius: 0.25rem;
		border: none;
		background-color: #efefef;
	}

	.pill:hover {
		background-color: lightgray;
		cursor: pointer;
	}
</style>
