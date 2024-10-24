<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';

	import {
		getTasks,
		getTags,
		createTask,
		moveTask,
		updateTask,
		deleteTask,
	} from '../lib/api/tasks';
	import Task from '../lib/components/task.svelte';
	import Pill from '../lib/components/pill.svelte';

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
	let selectedTask: TaskType | undefined = undefined;

	let selectedTaskDescription: string = '';
	let selectedTaskDetails: string = '';
	let selectedTaskTags: string = '';

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

	// Create new task props.
	let dialog: HTMLDialogElement;
	let taskDescription = '';

	function onDragStart(id: number) {
		return function (ev: DragEvent) {
			itemBeingDragged = id;
			console.log(ev);

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
				itemBeingDragged = null;
				return;
			}

			if (taskBeingMoved && (await $user)) {
				// FIXME: Add recovery code if move fails, e.g. by preserving original position in the drag event.
				await moveTask(taskBeingMoved, latestSwappedOrder);
				$tasks = await getTasks(selectedTag);
			}

			itemBeingDragged = null;
			latestSwappedOrder = null;
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

	async function createEmptyTask() {
		try {
			selectedTask = await createTask('', selectedTag ? [selectedTag.name] : []);

			selectedTaskDescription = '';
			selectedTaskDetails = '';

			$tasks = await getTasks(selectedTag);
		} catch (_) {
			$tasks = $tasks.filter((t) => t.id !== -1);
		}
	}

	async function updateSelectedTask() {
		if (!selectedTask) {
			return;
		}

		try {
			await updateTask(
				selectedTask,
				{
					description: selectedTaskDescription,
					details: selectedTaskDetails,
				},
				selectedTaskTags.split(', '),
			);
		} catch (e) {
			console.error(e);
		} finally {
			$tasks = await getTasks(selectedTag);
			tags = await getTags();
		}
	}

	async function createNewTask() {
		dialog.close();
		if (!(await $user)) {
			return;
		}

		const description = taskDescription.trim();
		taskDescription = '';

		const index = description.search(/( #[a-zA-Z\-_\d]+)+$/);
		if (index !== -1) {
			const newTags = description
				.substring(index)
				.split(' ')
				.filter((t) => t)
				.map((t) => t.substring(1));

			const descriptionWithoutTags = description.substring(0, index);

			const task: TaskType = {
				id: -1, // ID doesn't exist yet, use -1 for temporary tasks.
				description: descriptionWithoutTags,
				tags: newTags.map((t) => ({ id: 0, name: t })),
				order: -1, // Order doesn't matter or exist yet.
			};
			$tasks = [task, ...$tasks];

			// FIXME: fix flashing when the full task list is loaded.
			try {
				await createTask(descriptionWithoutTags, newTags);
				$tasks = await getTasks(selectedTag);
			} catch (_) {
				// Remove all temporary tasks.
				$tasks = $tasks.filter((t) => t.id !== -1);
				taskDescription = description;
			}
		} else {
			const task: TaskType = {
				id: -1, // ID doesn't exist yet, use -1 for temporary tasks.
				description,
				tags: [],
				order: -1, // Order doesn't matter or exist yet.
			};
			$tasks = [task, ...$tasks];

			// FIXME: fix flashing when the full task list is loaded.
			try {
				await createTask(description);
			} catch (_) {
				// Remove all temporary tasks.
				$tasks = $tasks.filter((t) => t.id !== -1);
				taskDescription = description;
			}
		}

		$tasks = await getTasks(selectedTag);
		tags = await getTags();
	}

	async function onDelete(task: TaskType) {
		if (!(await $user)) {
			return;
		}

		const indexOfTask = $tasks.findIndex((t) => t.id === task.id);

		// Remove task info from details UI.
		if (task.id === selectedTask?.id) {
			selectedTask = undefined;
		}

		try {
			$tasks = $tasks.filter((t) => t.id !== task.id);

			await deleteTask(task);

			tags = await getTags();
		} catch (_) {
			$tasks.splice(indexOfTask, 0, task);
		}
	}

	function debounce(func: Function, wait: number, immediate?: boolean) {
		var timeout: number | undefined;
		return function (this: any) {
			var context = this;
			var args = arguments;

			clearTimeout(timeout);

			if (immediate && !timeout) {
				func.apply(context, args);
			}

			timeout = setTimeout(function () {
				timeout = undefined;
				if (!immediate) {
					func.apply(context, args);
				}
			}, wait);
		};
	}
</script>

<main class="container-fluid">
	<div>
		<div class="task-list overflow-auto">
			<div class="add-task">
				<button on:click={createEmptyTask}>Add task</button>
			</div>

			<div class="task-search">
				<input type="text" placeholder="Search..." />
			</div>

			{#await fetchTags() then _}
				<div class="tags-list overflow-auto">
					<Pill onClick={() => (selectedTag = undefined)} isSelected={selectedTag === undefined}
						>All</Pill
					>
					{#each tags as tag}
						<Pill onClick={() => (selectedTag = tag)} isSelected={selectedTag === tag}
							>{tag.name}</Pill
						>
					{/each}
				</div>
			{:catch error}
				<p class="error">Failed to load tags: {error}</p>
			{/await}

			{#await fetchTasks()}
				<p>Loading…</p>
			{:then _}
				<ul>
					{#each $tasks as task (task.id)}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
						<li
							class={itemBeingDragged ? 'is-dragging' : ''}
							animate:flip={{ duration: 200 }}
							in:fade
							on:click={() => {
								selectedTask = task;
								selectedTaskDescription = task.description;
								selectedTaskDetails = task.details ?? '';
								selectedTaskTags = task.tags?.map((t) => t.name).join(', ') ?? '';
							}}
							draggable="true"
							on:dragstart={onDragStart(task.id)}
							on:dragend={onDragEnd()}
							on:dragenter|preventDefault={swapOnEnter(task.id)}
							on:dragover|preventDefault={() => {}}
						>
							<Task
								isSelected={task.id === selectedTask?.id}
								isDragging={itemBeingDragged === task.id}
								{onDelete}
								{task}
							/>
						</li>
					{/each}
				</ul>
			{:catch error}
				<p class="error">Failed to load tasks: {error}.</p>
			{/await}
		</div>

		<div class="task-details">
			<label for="title">Title</label>
			<input
				type="text"
				name="title"
				bind:value={selectedTaskDescription}
				disabled={selectedTask == undefined}
				on:change={debounce(updateSelectedTask, 200)}
				on:input={debounce(updateSelectedTask, 1000)}
			/>

			<label for="tags">Tags</label>
			<input
				type="text"
				name="tags"
				bind:value={selectedTaskTags}
				disabled={selectedTask == undefined}
				on:change={debounce(updateSelectedTask, 200)}
				on:input={debounce(updateSelectedTask, 1000)}
			/>

			<label for="details">Details</label>
			<textarea
				name="details"
				disabled={selectedTask == undefined}
				bind:value={selectedTaskDetails}
				on:change={debounce(updateSelectedTask, 200)}
				on:input={debounce(updateSelectedTask, 1000)}
			></textarea>
		</div>
	</div>
</main>

<style>
	main {
		max-width: 100vw;
		height: 100%;

		& > div {
			display: grid;
			grid-template-columns: 1fr 2fr;
		}

		& div.task-list {
			height: 90svb;
			padding: 0.5rem 1rem;
			border-inline-end: 1px solid var(--pico-color-violet-600);

			& div.tags-list {
				margin-block: 1rem;
				display: flex;
				flex-direction: row;
				gap: 1rem;
				flex-wrap: nowrap;
			}

			& div.task-search {
				margin-block: 1rem;

				& input {
					box-sizing: border-box;
					margin: 0;
				}
			}

			& div.add-task {
				margin-block: 1rem;

				& > * {
					width: 100%;
				}
			}
		}

		& div.task-details {
			padding: 1rem;

			display: flex;
			flex-direction: column;
			gap: 1rem;

			& input,
			& textarea {
				padding: 0.5rem;
				border: none;
			}

			& textarea {
				flex-grow: 1;
			}
		}
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
</style>
