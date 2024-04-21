import { getCsrfCookie, getUser } from '$lib/api';

export const ssr = false;

export async function load() {
	try {
		await getCsrfCookie();
		const user = await getUser();

		return { user };
	} catch (e) {
		// Not logged in.
		return { user: undefined };
	}
}
