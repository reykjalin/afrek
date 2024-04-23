<script lang="ts">
	import { getContext } from 'svelte';
	import { flip } from 'svelte/animate';
	import { goto } from '$app/navigation';

	import { getTasks, createTask, moveTask, deleteTask } from '$lib/api/tasks';
	import Task from '$lib/components/task.svelte';

	const { user } = getContext('auth');

	$: {
		if (!$user) {
			goto('/login');
		}
	}

	let tasks: Awaited<ReturnType<typeof getTasks>>;

	let fetchTasks = async () => {
		tasks = await getTasks($user);
	};

	// List props.
	let itemBeingDragged: number | null = null;
	let draggingEnabled = false;

	// Create new task props.
	let dialog: HTMLDialogElement;
	let taskDescription = '';

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
		return async function (ev: DragEvent) {
			const movedToIndex = tasks.findIndex((task) => task.id === id);
			const taskBeingMoved = tasks.find((t) => t.id === itemBeingDragged);

			if (taskBeingMoved) {
				// FIXME: Add recovery code if move fails, e.g. by preserving original position in the drag event.
				tasks = await moveTask($user, taskBeingMoved, movedToIndex);
			}

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

	function handleKeyPress(ev: KeyboardEvent) {
		// Make sure event propagates if the modal is already open
		if (dialog.open) {
			return;
		}

		ev.preventDefault();

		const { key } = ev;

		if (key === 'n') {
			console.log('create new task');
			ev.preventDefault();
			dialog.showModal();
		}
	}

	async function createNewTask() {
		dialog.close();
		tasks = await createTask($user, taskDescription);
		taskDescription = '';
	}

	async function onDelete(task: (typeof tasks)[0]) {
		tasks = await deleteTask($user, task);
	}
</script>

<svelte:window on:keydown={handleKeyPress} />

<dialog bind:this={dialog}>
	<form on:submit={createNewTask}>
		<input type="text" placeholder="fib the frobbler" bind:value={taskDescription} />
	</form>
</dialog>

<h2>Tasks</h2>

{#await fetchTasks()}
	<p>Loading…</p>
{:then _}
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
				<Task isDragging={itemBeingDragged === task.id} {onDelete} {task} />
			</li>
		{/each}
	</ul>
{:catch error}
	<p class="error">Failed to load tasks: {error}.</p>
{/await}

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

	dialog {
		max-width: 760px;
		width: 90vw;

		& input {
			/* FIXME: The input isn't centered when width is 100% for some reason. */
			width: 100%;
		}
	}
</style>
