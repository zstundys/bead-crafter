import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			// Output directory for the build
			pages: 'build',
			assets: 'build',
			fallback: 'index.html', // SPA fallback for client-side routing
			precompress: false,
			strict: true
		}),
		// Base path for GitHub Pages (update this to your repo name if needed)
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/beads' : ''
		}
	}
};

export default config;
