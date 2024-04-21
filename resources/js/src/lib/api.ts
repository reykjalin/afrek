import axios from '$lib/axios';
import { isAxiosError } from 'axios';
import { z } from 'zod';

const userSchema = z.object({
	id: z.number(),
	email: z.string().email(),
	email_verified_at: z.boolean().nullable(),
	created_at: z.string().datetime(),
	updated_at: z.string().datetime(),
});
export type User = z.infer<typeof userSchema>;

const getUserResponseSchema = z.object({
	data: userSchema,
});

async function getCsrfCookie() {
	return axios.get('/sanctum/csrf-cookie');
}

async function login(
	{
		email,
		password,
		remember = false,
	}: {
		email: string;
		password: string;
		remember: boolean;
	},
	setError: (error: string) => void,
) {
	try {
		setError('');

		return await axios.post('/login', {
			email,
			password,
			remember,
		});
	} catch (e) {
		if (isAxiosError(e)) {
			console.log(e);
			setError(e?.response?.data?.message ?? e.message);
		}
	}
}

async function logout() {
	return axios.post('/logout');
}

async function getUser() {
	try {
		const response = await axios.get('/api/user');
		const parsedResponse = getUserResponseSchema.parse(response);

		return parsedResponse.data;
	} catch (e) {
		if (isAxiosError(e)) {
			if (e.response?.status === 401) {
				// Not logged in. No need to log anything.
				return undefined;
			}

			console.log(`Failed to get user: ${e.message}`);
			console.log(e);
		} else {
			console.log('unknown error:', e);
		}

		return undefined;
	}
}

export { getCsrfCookie, login, logout, getUser };
