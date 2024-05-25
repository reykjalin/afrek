import axios from '../axios';
import z from 'zod';

const tagSchema = z.object({
	id: z.number(),
	name: z.string(),
});

const taskSchema = z.object({
	id: z.number(),
	description: z.string(),
	details: z.string().optional(),
	order: z.number(),
	tags: z.array(tagSchema).optional(),
});

export type Task = z.infer<typeof taskSchema>;
export type Tag = z.infer<typeof tagSchema>;

const tasksResponseSchema = z.array(taskSchema);
const tagsResponseSchema = z.array(tagSchema);

async function getTags() {
	const response = await axios.get('/api/tags');
	const tags = tagsResponseSchema.parse(response.data);

	return tags;
}

async function getTasks(tag?: Tag) {
	const response = await axios.get('/api/tasks');
	const tasks = tasksResponseSchema.parse(response.data);

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

export { getTasks, getTags, createTask, moveTask, deleteTask };
