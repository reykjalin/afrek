import { type Writable, writable } from 'svelte/store';
import { type User } from '$lib/api/auth';

export const user: Writable<User | undefined> = writable();
