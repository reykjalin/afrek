<script lang="ts">
	export let onClick: (() => void) | null = null;
	export let isSelected: boolean = false;

	function handleClick(_ev: MouseEvent) {
		if (onClick) {
			onClick();
		}
	}
</script>

{#if onClick}
	<button class={isSelected ? 'pill selected' : 'pill'} on:click={handleClick}
		><slot></slot></button
	>
{:else}
	<span class={isSelected ? 'pill selected' : 'pill'}><slot></slot></span>
{/if}

<style>
	.pill {
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		border: none;
		background-color: #f0f0f0;
	}

	.selected {
		background-color: lightgray;
	}

	button.pill:hover {
		background-color: lightgray;
		cursor: pointer;
	}
</style>
