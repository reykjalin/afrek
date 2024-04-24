<script lang="ts">
	export let type: 'submit' | 'reset' | 'button' | undefined = undefined;
	export let variant: 'primary' | 'secondary' | 'tertiary' = 'primary';
	export let tabindex: number | null | undefined = undefined;
	export let className: string | undefined = undefined;
	export let cursorStyle: 'pointer' | 'move' = 'pointer';

	export let onClick: ((ev: MouseEvent) => void) | undefined = undefined;
	export let onMouseDown: ((ev: MouseEvent) => void) | undefined = undefined;
</script>

<button
	{type}
	class={`${variant} ${className} ${cursorStyle}`}
	on:click={onClick}
	on:mousedown={onMouseDown}
	{tabindex}
>
	<slot></slot>
</button>

<style>
	button {
		border: none;
		background: none;
		width: fit-content;
		padding: 0.5rem 1rem;
		border-radius: 0.25rem;

		cursor: pointer;

		&.primary {
			background-color: #4c6ef5;
			color: white;

			&:hover {
				background-color: #748ffc;
			}
		}

		&.tertiary {
			padding: 0.25rem 0.5rem;
			border: 1px solid lightgray;

			&:hover {
				background-color: lightgray;
			}
		}

		&.move {
			cursor: move;
		}
	}
</style>
