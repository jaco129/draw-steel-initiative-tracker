import { sveltekit } from '@sveltejs/kit/vite';

export default {
  plugins: [sveltekit()],
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.json', '.svelte']
  },
  css: {
    postcss: null // Remove or set to null if explicitly defined
  }
};
