import Tasks from './Tasks.svelte';
import { mount } from "svelte";

const tasksComponent = document.getElementById('tasks');

const tasks = tasksComponent
	? mount(Tasks, {
    			target: tasksComponent,
    		})
	: null;

export default tasks;
