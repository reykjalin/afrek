import { type Writable, writable } from 'svelte/store';
import { type User, getUser } from '../api/auth';

export const user: Writable<User | undefined> = writable(await getUser());
