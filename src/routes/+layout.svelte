<script>
	import '../app.css';
	import SettingsModal from './SettingsModal.svelte';
	import initWorker from '$lib/sqlite/loadWorker';
	import { onMount } from 'svelte';

	let isOpen = false;

	onMount(() => {
		initWorker();
	});
</script>

<div class="min-h-screen flex flex-col">
	<header class="bg-indigo-600 px-2 py-1 flex justify-between items-center">
		<div>
			<span class="text-2xl font-semibold text-white">SvelteKit Offline</span>
		</div>
		<div>
			<button
				class="text-white h-8 w-8 flex items-center hover:text-indigo-200 focus:outline-none focus:ring-1 focus:ring-pink-300 p-1 rounded-md"
				on:click={() => (isOpen = true)}
				><svg
					fill="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						clip-rule="evenodd"
						fill-rule="evenodd"
						d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
					/>
				</svg>
			</button>
		</div>
	</header>
	<main class="flex-grow">
		<slot />
		<SettingsModal bind:isOpen />
	</main>
	<footer>...</footer>
</div>
