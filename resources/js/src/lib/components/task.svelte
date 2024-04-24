<script lang="ts">
	import { type Task } from '$lib/api/tasks';

	import Button from '$lib/components/button.svelte';

	export let task: Task;

	export let isDragging = false;
	export let onDelete: (t: typeof task) => void;

	function buttonHandler(_ev: MouseEvent) {
		onDelete(task);
	}
</script>

<div class={`${isDragging ? 'is-dragging ' : ''}task`}>
	<div>
		<Button variant="tertiary" onClick={buttonHandler}>✅</Button>
		<p>{task.description}</p>
	</div>

	{#if import.meta.env.MODE === 'development'}
		<div class="meta">
			<p><small><b>ID:</b> {task.id}</small></p>
			<p><small><b>Order:</b> {task.order}</small></p>
			<details>
				<summary><small>Details</small></summary><small>{task.details}</small>
			</details>
		</div>
	{/if}
</div>

<style>
	div.task {
		border: 1px solid black;
		border-radius: 0.25rem;
		padding: 1rem;
		margin: 0.5rem;
		width: 100%;

		& p {
			padding: 0;
			margin: 0.5rem 0;
		}

		& div:not(.meta) {
			border: none;
			display: flex;
			flex-direction: row;
			gap: 0.5rem;
			justify-content: space-between;
			align-items: center;

			& p {
				padding: 0;
				margin: 0;
				flex-grow: 1;
			}
		}
	}

	.is-dragging {
		background-color: lightgray;

		& > * {
			opacity: 0;
		}
	}
</style>
