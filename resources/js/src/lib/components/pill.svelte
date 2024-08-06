<script lang="ts">
	export let onClick: (() => void) | null = null;
	export let isSelected: boolean = false;

	function handleClick(_ev: MouseEvent) {
		if (onClick) {
			onClick();
		}
	}
</script>

<button class={isSelected ? '' : 'outline'} on:click={handleClick}><slot></slot></button>

<style>
</style>
