import { fail } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async (event) => {
		// FIXME: Register the user.

		const { fetch } = event;

		const csrf = await event.fetch('/api/sanctum/csrf-cookie', {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			credentials: 'include',
		});
		const cookies = csrf.headers.get('set-cookie') ?? '';

		const getCsrfToken = (cookies: string[]) => {
			for (const cookie of cookies) {
				if (cookie.startsWith('XSRF-TOKEN')) {
					return decodeURIComponent(cookie.split('=')[1]);
				}
			}

			return '';
		};

		const token = getCsrfToken(cookies.split(';'));

		console.log('token:', token);

		const data = await event.request.formData();
		const email = data.get('email');
		const password = data.get('password');
		const confirmPassword = data.get('confirm-password');

		const response = await event.fetch('/api/register', {
			method: 'POST',
			body: JSON.stringify({ email, password, password_confirmation: confirmPassword }),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'X-XSRF-TOKEN': token,
			},
			credentials: 'include',
		});

		if (response.ok) {
			return { success: true };
		}

		return fail(response.status, await response.json());
	},
};
