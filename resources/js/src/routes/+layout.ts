import { getCsrfCookie, getUser } from '$lib/api';

export const ssr = false;

export async function load() {
	try {
		await getCsrfCookie();
		const response = await getUser();

		return { user: response.data };
	} catch (e) {
		// Not logged in.
		return { user: undefined };
	}
}
