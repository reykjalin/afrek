<script lang="ts">
	import { type Task } from '$lib/api/tasks';

	export let task: Task;

	export let isDragging = false;
	export let onDelete: (t: typeof task) => void;

	function buttonHandler(ev: MouseEvent) {
		onDelete(task);
	}
</script>

<div class={isDragging ? 'is-dragging' : ''}>
	<div>
		<button on:click={buttonHandler}>✅</button>
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
	div {
		border: 1px solid black;
		border-radius: 0.25rem;
		padding: 0.5rem;
		margin: 0.5rem;

		& p {
			padding: 0;
			margin: 0.5rem 0;
		}

		& button {
			background-color: white;
			border: 1px solid lightgray;
			border-radius: 0.25rem;
			padding: 0.25rem 0.5rem;

			&:hover,
			&:focus {
				background-color: lightgray;
			}
		}

		& div {
			border: none;
			display: flex;
			flex-direction: row;
			gap: 0.5rem;
			justify-content: space-between;
			align-items: center;

			& p {
				padding: 0;
				margin: 0;
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
