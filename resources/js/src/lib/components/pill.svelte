<script lang="ts">
	interface Props {
		onClick?: (() => void) | null;
		isSelected?: boolean;
		children?: import('svelte').Snippet;
	}

	let { onClick = null, isSelected = false, children }: Props = $props();

	function handleClick(_ev: MouseEvent) {
		if (onClick) {
			onClick();
		}
	}
</script>

<button class={isSelected ? '' : 'outline'} onclick={handleClick}>{@render children?.()}</button>

<style>
</style>
