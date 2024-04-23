<script lang="ts">
	import { getContext } from 'svelte';
	import { flip } from 'svelte/animate';
	import { goto } from '$app/navigation';

	import { tasks as t } from '$lib/tasks';
	import Task from '$lib/components/task.svelte';

	const { user } = getContext('auth');

	$: {
		if (!$user) {
			goto('/login');
		}
	}

	let tasks = t;

	let itemBeingDragged: number | null = null;
	let draggingEnabled = false;

	function onDragStart(id: number) {
		return function (ev: DragEvent) {
			itemBeingDragged = id;

			if (ev.dataTransfer) {
				ev.dataTransfer.effectAllowed = 'move';
				ev.dataTransfer.dropEffect = 'move';
			}
		};
	}

	function onDragEnd(id: number) {
		return function (ev: DragEvent) {
			const draggingIndex = tasks.findIndex((task) => task.id === id);

			// FIXME: Update API with new task position.

			console.log('new pos:', draggingIndex);

			itemBeingDragged = null;
			draggingEnabled = false;
		};
	}

	function swapOnEnter(id: number) {
		return function (ev: DragEvent) {
			// Don't swap if we just entered the item we're dragging, or if nothing is dragging.
			if (itemBeingDragged === null || itemBeingDragged === id) {
				return;
			}

			const enteredIndex = tasks.findIndex((t) => t.id === id);
			const draggingIndex = tasks.findIndex((t) => t.id === itemBeingDragged);

			const tmp = tasks[enteredIndex];
			tasks[enteredIndex] = tasks[draggingIndex];
			tasks[draggingIndex] = tmp;
		};
	}

	function enableDragging() {
		draggingEnabled = true;
	}
</script>

<h2>Tasks</h2>

<ul>
	{#each tasks as task (task.id)}
		<li
			class={itemBeingDragged ? 'is-dragging' : ''}
			animate:flip={{ duration: 300 }}
			draggable={draggingEnabled}
			on:dragstart={onDragStart(task.id)}
			on:dragend={onDragEnd(task.id)}
			on:dragenter|preventDefault={swapOnEnter(task.id)}
			on:dragover|preventDefault={() => {}}
		>
			<button on:mousedown={enableDragging}>anchor</button>
			<Task isDragging={itemBeingDragged === task.id} {task} />
		</li>
	{/each}
</ul>

<style>
	ul {
		list-style-type: none;
		padding-inline-start: 0;

		& li {
			display: flex;
			flex-direction: row;
			gap: 0.5rem;
			align-items: center;
		}

		& li.is-dragging * {
			/* Make sure dragenter and dragleave only fire once. */
			pointer-events: none;
		}
	}
</style>
