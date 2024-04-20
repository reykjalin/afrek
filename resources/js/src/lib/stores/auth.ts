import { type Writable, writable } from 'svelte/store';

interface User {
	email: string;
	id: number;
	created_at: string;
	email_verified_at: boolean | null;
	updated_at: string;
}

export const user: Writable<User | undefined> = writable();
