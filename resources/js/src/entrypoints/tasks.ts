import Tasks from './Tasks.svelte';

const tasksComponent = document.getElementById('tasks');

const tasks = tasksComponent
	? new Tasks({
			target: tasksComponent,
		})
	: null;

export default tasks;
