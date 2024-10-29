import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [
		laravel({
			input: [
				'resources/css/style.css',
				'resources/css/pico.colors.min.css',
				'resources/css/pico.violet.min.css',
				'resources/js/src/entrypoints/header.ts',
				'resources/js/src/entrypoints/footer.ts',
				'resources/js/src/app.ts',
			],
			refresh: true,
		}),
		svelte(),
	],
	build: {
		target: 'esnext',
	},
});
