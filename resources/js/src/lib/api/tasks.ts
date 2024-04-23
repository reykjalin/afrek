import { tasks as t } from '$lib/tasks';

type Task = (typeof tasks)[0];

let tasks = t;

function getNewId(tasks: Task[]) {
	return Math.max(...tasks.map((t) => t.id)) + 1;
}

async function getTasks() {
	tasks = tasks.sort((a, b) => a.order - b.order);
	return tasks;
}

async function createTask(description: string) {
	const task = {
		id: getNewId(tasks),
		description,
		order: 0,
		details: '',
		created_at: Date.now().toString(),
	};

	tasks = [task, ...tasks.map((t) => ({ ...t, order: t.order + 1 }))];
	return tasks;
}

async function moveTask(task: Task, to: number) {
	if (to < 0 || to > tasks.length) {
		throw new Error('Cannot move task outside array bounds.');
	}

	// Nothing to do.
	if (task.order === to) {
		return tasks;
	}

	tasks = tasks
		.map((t) => {
			// If it's the task we're moving, just update the order prop.
			if (t.id === task.id) {
				return {
					...task,
					order: to,
				};
			}

			if (task.order < to) {
				if (t.order <= to && t.order > task.order) {
					return {
						...t,
						order: t.order - 1,
					};
				}

				return t;
			}

			if (task.order > to) {
				if (t.order >= to && t.order < task.order) {
					return {
						...t,
						order: t.order + 1,
					};
				}

				return t;
			}

			// Should never reach here.
			throw new Error('moveTask: Reached code that should not be reached.');
		})
		.sort((a, b) => a.order - b.order);

	return tasks;
}

async function deleteTask(task: (typeof tasks)[0]) {
	tasks = tasks
		.filter((t) => t.id !== task.id)
		.map((t) => {
			if (t.order < task.order) {
				return t;
			}

			return {
				...t,
				order: t.order - 1,
			};
		});
	return tasks;
}

export { getTasks, createTask, moveTask, deleteTask };
