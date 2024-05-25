import { type Writable, writable } from 'svelte/store';
import { type Task } from '../api/tasks';

export const tasks: Writable<Task[]> = writable([]);
