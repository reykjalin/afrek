<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';

	import { getTasks, getTags, createTask, moveTask, deleteTask } from '../lib/api/tasks';
	import Task from '../lib/components/task.svelte';
	import Pill from '../lib/components/pill.svelte';
	import PageTitle from '../lib/components/pagetitle.svelte';
	import Button from '../lib/components/button.svelte';
	import Icon from '../lib/components/icon.svelte';

	import { user } from '../lib/stores/auth';
	import { tasks } from '../lib/stores/tasks';
	import type { Task as TaskType, Tag } from '../lib/api/tasks';

	$: {
		$user.then((u) => {
			if (!u) {
				window.location.href = '/login';
			} else {
				getTasks(selectedTag).then((t) => ($tasks = t));
			}
		});
	}

	let selectedTag: Tag | undefined = undefined;
	let tags: Tag[] = [];

	let fetchTasks = async () => {
		if (await $user) {
			$tasks = await getTasks();
		}
	};

	let fetchTags = async () => {
		if (await $user) {
			tags = await getTags();
		}
	};

	// List props.
	let itemBeingDragged: number | null = null;
	let latestSwappedOrder: number | null = null;
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

	function onDragEnd() {
		return async function (_ev: DragEvent) {
			const taskBeingMoved = $tasks.find((t) => t.id === itemBeingDragged);

			if (!latestSwappedOrder || !taskBeingMoved) {
				return;
			}

			if (taskBeingMoved && (await $user)) {
				// FIXME: Add recovery code if move fails, e.g. by preserving original position in the drag event.
				await moveTask(taskBeingMoved, latestSwappedOrder);
				$tasks = await getTasks(selectedTag);
			}

			itemBeingDragged = null;
			latestSwappedOrder = null;
			draggingEnabled = false;
		};
	}

	function swapOnEnter(id: number) {
		return function (_ev: DragEvent) {
			// Don't swap if we just entered the item we're dragging, or if nothing is dragging.
			if (itemBeingDragged === null || itemBeingDragged === id) {
				return;
			}

			const enteredIndex = $tasks.findIndex((t) => t.id === id);
			const draggingIndex = $tasks.findIndex((t) => t.id === itemBeingDragged);

			const tmp = $tasks[enteredIndex];
			$tasks[enteredIndex] = $tasks[draggingIndex];
			$tasks[draggingIndex] = tmp;

			latestSwappedOrder = tmp.order;
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

		const { key } = ev;

		if (key === 'n') {
			console.log('create new task');
			ev.preventDefault();
			dialog.showModal();
		}
	}

	async function createNewTask() {
		dialog.close();
		if (!(await $user)) {
			return;
		}

		const index = taskDescription.trimEnd().search(/( #[a-zA-Z\-_\d]+)+$/);
		if (index !== -1) {
			const newTags = taskDescription
				.substring(index)
				.split(' ')
				.filter((t) => t)
				.map((t) => t.substring(1));

			await createTask(taskDescription.substring(0, index), newTags);
			$tasks = await getTasks(selectedTag);
		} else {
			await createTask(taskDescription);
		}

		$tasks = await getTasks(selectedTag);
		tags = await getTags();

		taskDescription = '';
	}

	async function onDelete(task: TaskType) {
		if (!(await $user)) {
			return;
		}

		await deleteTask(task);

		$tasks = await getTasks(selectedTag);
		tags = await getTags();
	}
</script>

<svelte:window on:keydown={handleKeyPress} />

<main>
	<dialog bind:this={dialog}>
		<form on:submit|preventDefault={createNewTask}>
			<label for="description"><b>New task:</b></label>
			<input
				name="description"
				type="text"
				placeholder="fib the frobbler"
				bind:value={taskDescription}
			/>
		</form>
	</dialog>

	<PageTitle>Tasks</PageTitle>

	{#await fetchTags() then _}
		<p
			style={'text-align:center;display:flex;flex-direction:row;gap:0.5rem;justify-content:center;'}
		>
			<Pill onClick={() => (selectedTag = undefined)}>All</Pill>
			{#each tags as tag}
				<Pill onClick={() => (selectedTag = tag)}>{tag.name}</Pill>
			{/each}
		</p>
	{:catch error}
		<p class="error">Failed to load tags: {error}</p>
	{/await}

	{#await fetchTasks()}
		<p>Loading…</p>
	{:then _}
		<ul>
			{#each $tasks as task (task.id)}
				<li
					class={itemBeingDragged ? 'is-dragging' : ''}
					animate:flip={{ duration: 200 }}
					in:fade
					draggable={draggingEnabled}
					on:dragstart={onDragStart(task.id)}
					on:dragend={onDragEnd()}
					on:dragenter|preventDefault={swapOnEnter(task.id)}
					on:dragover|preventDefault={() => {}}
				>
					<!-- Use tabindex to make it so anchor can't be reached by tabbing through the page. -->
					<Button
						variant="tertiary"
						className="anchor"
						tabindex={-1}
						cursorStyle="move"
						onMouseDown={enableDragging}
					>
						<span><Icon icon="E265" width="25" /></span>
					</Button>
					<Task isDragging={itemBeingDragged === task.id} {onDelete} {task} />
				</li>
			{/each}
		</ul>
	{:catch error}
		<p class="error">Failed to load tasks: {error}.</p>
	{/await}
</main>

<style>
	button.anchor {
		cursor: move;
	}

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
			margin-block: 0.25rem;
		}
	}
</style>
