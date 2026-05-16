import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		include: ['dexie', 'lucide-svelte', 'clsx', 'tailwind-merge'],
	},
	preview: {
		port: 4173,
	},
});