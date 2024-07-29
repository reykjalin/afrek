<script lang="ts">
	import { type Task } from '../api/tasks';

	import Button from '../components/button.svelte';
	import Pill from '../components/pill.svelte';
	import Icon from '../components/icon.svelte';

	export let task: Task;

	export let isDragging = false;
	export let onDelete: (t: typeof task) => void;

	function buttonHandler(_ev: MouseEvent) {
		onDelete(task);
	}
</script>

<div class={`${isDragging ? 'is-dragging ' : ''}task`}>
	<div>
		<p>{task.description}</p>
		<Button variant="tertiary" onClick={buttonHandler}>&#10003;</Button>
	</div>

	<div class="tags">
		{#each task.tags ?? [] as tag}
			<Pill>{tag.name}</Pill>
		{/each}
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

		background-color: white;

		& p {
			padding: 0;
			margin: 0.5rem 0;
		}

		& div.tags {
			margin-block-start: 0.5rem;
			display: flex;
			flex-direction: row;
			gap: 0.5rem;
		}

		& div:not(.meta):not(.tags) {
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
