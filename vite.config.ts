import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import crossOriginIsolation from 'vite-plugin-cross-origin-isolation';

export default defineConfig({
	server: {
		https: true,
		proxy: {}
	},

	plugins: [sveltekit(), mkcert(), crossOriginIsolation()]
});
