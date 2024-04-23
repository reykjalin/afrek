export interface Task {
	id: number;
	description: string;
	details?: string;
	order: number;
}

let tasks: Task[] = [];

function getNewId(tasks: Task[]) {
	// Default to ID 1 if there are no tasks.
	if (tasks.length === 0) {
		return 1;
	}

	return Math.max(...tasks.map((t) => t.id)) + 1;
}

function loadTasks(user: Partial<{ id: number }>) {
	if (tasks.length === 0) {
		// Try to get from localStorage.
		tasks = JSON.parse(localStorage.getItem(`tasks-${user.id}`) ?? '[]');
	}
}

async function getTasks(user: Partial<{ id: number }>) {
	loadTasks(user);

	tasks = tasks.sort((a, b) => a.order - b.order);
	return tasks;
}

async function createTask(user: Partial<{ id: number }>, description: string) {
	loadTasks(user);

	const task = {
		id: getNewId(tasks),
		description,
		order: 0,
		details: '',
		created_at: Date.now().toString(),
	};

	tasks = [task, ...tasks.map((t) => ({ ...t, order: t.order + 1 }))];

	if (user) {
		localStorage.setItem(`tasks-${user.id}`, JSON.stringify(tasks));
	}

	return tasks;
}

async function moveTask(user: Partial<{ id: number }>, task: Task, to: number) {
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

	if (user) {
		localStorage.setItem(`tasks-${user.id}`, JSON.stringify(tasks));
	}

	return tasks;
}

async function deleteTask(user: Partial<{ id: number }>, task: (typeof tasks)[0]) {
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

	if (user) {
		localStorage.setItem(`tasks-${user.id}`, JSON.stringify(tasks));
	}

	return tasks;
}

async function clearTasks() {
	tasks = [];
}

export { getTasks, createTask, moveTask, deleteTask, clearTasks };
