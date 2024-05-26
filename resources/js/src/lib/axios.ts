import axios from 'axios';

export default axios.create({
	baseURL: import.meta.env.VITE_API_URL as string,
	headers: {
		'X-Requested-With': 'XMLHttpRequest',
	},
	withCredentials: true,
	withXSRFToken: true,
});
