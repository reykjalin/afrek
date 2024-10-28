<script lang="ts">
	import { type Task } from '../api/tasks';

	import Pill from '../components/pill.svelte';


	interface Props {
		task: Task;
		isDragging?: boolean;
		onDelete: (t: typeof task) => void;
		isSelected?: boolean;
	}

	let {
		task,
		isDragging = false,
		onDelete,
		isSelected = false
	}: Props = $props();

	function buttonHandler(_ev: MouseEvent) {
		onDelete(task);
	}
</script>

<article class={`${isDragging ? 'is-dragging ' : ''}${isSelected ? 'selected ' : ''}task`}>
	<p>{task.description}</p>

	<footer>
		<button class="outline" onclick={buttonHandler}>&#10003;</button>

		<div class="tags overflow-auto">
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
	</footer>
</article>

<style>
	article.task {
		border: 1px solid var(--pico-color-violet-600);
		border-radius: 0.25rem;
		padding: 1rem;
		width: 100%;

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

		& footer {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
		}
	}

	.is-dragging {
		background-color: var(--pico-color-violet-400);

		& > * {
			opacity: 0;
		}
	}

	.selected {
		outline: 3px solid var(--pico-color-violet-400);
	}
</style>
