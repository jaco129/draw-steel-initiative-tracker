import { sveltekit } from '@sveltejs/kit/vite';

export default {
  plugins: [sveltekit()],
  css: {
    postcss: null // Remove or set to null if explicitly defined
  }
};
