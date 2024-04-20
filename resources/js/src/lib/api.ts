import axios from '$lib/axios';
import { isAxiosError } from 'axios';

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
	return axios.get('/api/user');
}

export { getCsrfCookie, login, logout, getUser };
