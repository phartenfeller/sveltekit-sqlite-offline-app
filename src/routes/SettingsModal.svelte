<script lang="ts">
	import Logger, { type LogLevel } from '$lib/logger';
	import {
		Dialog,
		DialogOverlay,
		DialogTitle,
		DialogDescription,
		TransitionChild,
		Transition
	} from '@rgossiaux/svelte-headlessui';
	import { onMount } from 'svelte';

	export let isOpen: boolean;
	let allLevels: LogLevel[];
	let currLevel: LogLevel;
	let logger: Logger;

	onMount(() => {
		logger = Logger.getInstance();

		allLevels = logger.getAllLevels();
		currLevel = logger.getLevel();
	});
</script>

<Transition show={isOpen}>
	<Dialog class="relative z-10" on:close={() => (isOpen = false)}>
		<!-- Use one `TransitionChild` to apply one transition to the overlay... -->
		<TransitionChild
			enter="ease-out duration-300"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="ease-in duration-200"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		>
			<DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
		</TransitionChild>

		<div class="fixed inset-0 z-10 overflow-y-auto">
			<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
				<TransitionChild
					enter="ease-out duration-300"
					enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					enterTo="opacity-100 translate-y-0 sm:scale-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100 translate-y-0 sm:scale-100"
					leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
				>
					<div
						class="relative transform overflow-hidden min-w-[480px] rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
					>
						<div class="flex justify-between items-center">
							<DialogTitle
								><h3 class="text-2xl font-semibold text-black">Preferences</h3></DialogTitle
							>
							<button
								type="button"
								class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2"
								on:click={() => (isOpen = false)}
							>
								<span class="sr-only">Close</span>
								<div class="h-6 w-6" aria-hidden="true">
									<svg
										fill="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
										aria-hidden="true"
									>
										<path
											clip-rule="evenodd"
											fill-rule="evenodd"
											d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
										/>
									</svg>
								</div>
							</button>
						</div>
						<div class="mt-4">
							<fieldset>
								<legend class="text-sm font-semibold leading-6 text-gray-900">Log Level</legend>
								<p class="mt-1 text-sm leading-6 text-gray-600">
									Choose the level of logs to display in console.
								</p>
								<div class="mt-1 space-y-1">
									{#each allLevels as level}
										<div class="flex items-center gap-x-3">
											<input
												id="pref-{level}"
												name="pref-loglevel"
												type="radio"
												class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
												bind:group={currLevel}
												value={level}
												on:change={() => {
													logger.setLogLevel(currLevel);
												}}
											/>
											<label
												for="pref-{level}"
												class="block text-sm font-medium leading-6 text-gray-700"
											>
												{level}
											</label>
										</div>
									{/each}
								</div>
							</fieldset>
						</div>
					</div>
				</TransitionChild>
			</div>
		</div>
	</Dialog>
</Transition>
