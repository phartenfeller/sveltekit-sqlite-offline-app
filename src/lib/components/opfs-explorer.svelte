<script lang="ts">
	// src from: https://github.com/tomayac/opfs-explorer/blob/main/contentscript.js

	type fileType = {
		name: string;
		kind: string;
		size: number;
		type: string;
		lastModified: number;
		relativePath: string;
	};

	let fileHandles: any[] = [];
	let directoryHandles: any[] = [];

	let fileList: fileType[] = [];

	async function getDirectoryEntriesRecursive(directoryHandle: any, relativePath = '.') {
		const entries: any = {};
		// Get an iterator of the files and folders in the directory.
		const directoryIterator = directoryHandle.values();
		const directoryEntryPromises = [];
		for await (const handle of directoryIterator) {
			const nestedPath = `${relativePath}/${handle.name}`;
			if (handle.kind === 'file') {
				fileHandles.push({ handle, nestedPath });
				directoryEntryPromises.push(
					handle.getFile().then((file: fileType) => {
						return {
							name: handle.name,
							kind: handle.kind,
							size: file.size,
							type: file.type,
							lastModified: file.lastModified,
							relativePath: nestedPath
						};
					})
				);
			} else if (handle.kind === 'directory') {
				directoryHandles.push({ handle, nestedPath });
				directoryEntryPromises.push(
					(async () => {
						return {
							name: handle.name,
							kind: handle.kind,
							relativePath: nestedPath,
							entries: await getDirectoryEntriesRecursive(handle, nestedPath)
						};
					})()
				);
			}
		}
		const directoryEntries = await Promise.all(directoryEntryPromises);
		directoryEntries.forEach((directoryEntry) => {
			entries[directoryEntry.name] = directoryEntry;
		});
		return entries;
	}

	function getFileHandle(path: string) {
		return fileHandles.find((element) => {
			return element.nestedPath === path;
		});
	}

	function getDirectoryHandle(path: string) {
		return directoryHandles.find((element) => {
			return element.nestedPath === path;
		});
	}

	async function getDirectoryStructure() {
		fileHandles = [];
		directoryHandles = [];
		const root = await navigator.storage.getDirectory();
		const structure = await getDirectoryEntriesRecursive(root);
		const rootStructure = {
			'.': {
				kind: 'directory',
				relativePath: '.',
				entries: structure
			}
		};

		const values = Object.values(rootStructure['.'].entries) as fileType[];
		fileList = values.map((file: fileType) => {
			return {
				name: file.name,
				kind: file.kind,
				size: file.size,
				type: file.type,
				lastModified: file.lastModified,
				relativePath: file.relativePath
			};
		});
	}

	async function saveFile(path: string) {
		const fileHandle = getFileHandle(path).handle;
		try {
			const handle = await window.showSaveFilePicker({
				suggestedName: fileHandle.name
			});
			const writable = await handle.createWritable();
			await writable.write(await fileHandle.getFile());
			await writable.close();
		} catch (error: any) {
			if (error.name !== 'AbortError') {
				console.error(error.name, error.message);
			}
		}
	}

	async function deleteFile(path: string) {
		const fileHandle = getFileHandle(path).handle;
		try {
			await fileHandle.remove();
		} catch (error: any) {
			console.error(error.name, error.message);
		}
		getDirectoryStructure();
	}

	async function deleteDirectory(path: string) {
		const directoryHandle = getDirectoryHandle(path)?.handle;
		if (!directoryHandle) return;
		try {
			await directoryHandle.remove({ recursive: true });
		} catch (error: any) {
			console.error(error.name, error.message);
		}
		getDirectoryStructure();
	}
</script>

<div>
	<div class="flex justify-between items-center">
		<h2 class="block text-gray-900 font-semibold">OPFS Explorer</h2>
		<div>
			<button
				class=" border border-slate-300 px-2 py-1 rounded-md hover:bg-slate-100 focus:outline-none focus:border-pink-300"
				title="Refresh"
				on:click={getDirectoryStructure}
				><svg
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
					class="w-4 h-4"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
					/>
				</svg></button
			>

			<!-- <button
				class=" border border-slate-300 px-2 py-1 rounded-md hover:bg-slate-100 focus:outline-none focus:border-pink-300"
				title="Delete All Files"
				on:click={() => deleteDirectory('.')}
				><svg
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
					class="h-4 w-4"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
					/>
				</svg></button
			> -->
		</div>
	</div>
	{#if fileList.length > 0}
		<div class="mt-8 flow-root">
			<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
				<div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
					<table class="min-w-full divide-y divide-gray-300">
						<thead>
							<tr>
								<th class="py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
									>Path</th
								>
								<th class="px-3 py-2 text-left text-sm font-semibold text-gray-900">Size</th>
								<th class="px-3 py-2 text-left text-sm font-semibold text-gray-900"
									>Last Modified</th
								>
								<th class="px-3 py-2 text-left text-sm font-semibold text-gray-900">Actions</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200">
							{#each fileList as file}
								<tr>
									<td
										class="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
										>{file.relativePath}</td
									>
									<td class="whitespace-nowrap px-3 py-2 text-sm text-gray-500">{file.size}</td>
									<td class="whitespace-nowrap px-3 py-2 text-sm text-gray-500"
										>{new Date(file.lastModified).toLocaleString()}</td
									>
									<td class="whitespace-nowrap px-3 py-2 text-sm text-gray-500"
										><button
											class=" border border-slate-300 px-2 py-1 rounded-md hover:bg-slate-100 focus:outline-none focus:border-pink-300"
											title="Download"
											on:click={() => saveFile(file.relativePath)}
											><svg
												fill="none"
												stroke="currentColor"
												stroke-width="1.5"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
												aria-hidden="true"
												class="h-4 w-4"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
												/>
											</svg></button
										>
										<button
											class=" border border-slate-300 px-2 py-1 rounded-md hover:bg-slate-100 focus:outline-none focus:border-pink-300"
											title="Delete"
											on:click={() => deleteFile(file.relativePath)}
											><svg
												fill="none"
												stroke="currentColor"
												stroke-width="1.5"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
												aria-hidden="true"
												class="h-4 w-4"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
												/>
											</svg></button
										></td
									>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	{/if}
</div>
