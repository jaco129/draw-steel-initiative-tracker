import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
	paths: {
		base: '/draw-steel-initiative-tracker',
	}
  },
  preprocess: vitePreprocess()
};

export default config;
