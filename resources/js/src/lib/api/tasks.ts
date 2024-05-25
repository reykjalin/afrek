import axios from '../axios';
import z from 'zod';

const taskSchema = z.object({
	id: z.number(),
	description: z.string(),
	details: z.string().optional(),
	order: z.number(),
	tags: z.array(z.string()).optional(),
});

export type Task = z.infer<typeof taskSchema>;

const tasksResponseSchema = z.array(taskSchema);

async function getTasks(tag?: string) {
	const response = await axios.get('/api/tasks');
	const tasks = tasksResponseSchema.parse(response.data);

	if (tag) {
		return tasks.filter((t) => t.tags?.indexOf(tag) !== -1);
	}
	return tasks;
}

async function createTask(description: string, tags?: string[]) {
	const newTaskData = {
		description,
		details: '',
		tags: tags ?? [],
	};

	const response = await axios.post('/api/tasks', newTaskData);
	const task = taskSchema.parse(response.data);
	return task;
}

async function moveTask(task: Task, order: number) {
	// FIXME: Implement me here.
	console.log(`move task ${task.id} to ${order}`);
}

async function deleteTask(task: Task) {
	await axios.delete(`/api/tasks/${task.id}`);
}

export { getTasks, createTask, moveTask, deleteTask };
