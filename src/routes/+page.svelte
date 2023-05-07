<script lang="ts">
	import { runQuery } from '$lib/sqlite/dataApi';
	import { waitTillStroageReady } from '$lib/sqlite/initStorages';
	import { onMount } from 'svelte';

	let storageReady = false;

	onMount(async () => {
		await waitTillStroageReady('customers_v1');
		storageReady = true;
		const data = await runQuery(`update customers_v1 set company = 'xyz' where 1 = 1`);
		console.log(data);
		const data2 = await runQuery('SELECT * FROM customers_v1 limit 10');
		console.log(data2);
	});
</script>

<h1 class="text-5xl text-teal-500">SvelteKit Offline SQLite</h1>

<div>
	Storage Ready: {storageReady ? 'true' : 'false'}
</div>
