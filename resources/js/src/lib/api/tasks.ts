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
	const getUrl = () => {
		if (tag) {
			return `api/tasks?tag=${tag.id}`;
		}

		return '/api/tasks';
	};

	const response = await axios.get(getUrl());
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

async function updateTask(task: Task, updatedTaskData: Partial<Task>, tags?: string[]) {
	const response = await axios.patch(`/api/tasks/update/${task.id}`, { ...updatedTaskData, tags });
	return taskSchema.parse(response.data);
}

async function moveTask(task: Task, order: number) {
	const response = await axios.patch(`/api/tasks/move/${task.id}`, { new_pos: order });
	const updatedTask = taskSchema.parse(response.data);

	return updatedTask;
}

async function deleteTask(task: Task) {
	await axios.delete(`/api/tasks/${task.id}`);
}

export { getTasks, getTags, createTask, moveTask, updateTask, deleteTask };
