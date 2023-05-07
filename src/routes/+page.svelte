<script lang="ts">
	import type { Customer } from '$lib/server/db';
	import { runQuery } from '$lib/sqlite/dataApi';
	import { waitTillStroageReady } from '$lib/sqlite/initStorages';
	import { onMount } from 'svelte';

	let storageReady = false;
	let customers: Customer[] = [];

	onMount(async () => {
		await waitTillStroageReady('customers_v1');
		storageReady = true;
		customers = (await runQuery('SELECT * FROM customers_v1 limit 10')) as Customer[];
		console.log(customers);
	});
</script>

<h1 class="text-5xl text-teal-500">SvelteKit Offline SQLite</h1>

<div>
	Storage Ready: {storageReady ? 'true' : 'false'}
</div>

<div>
	{#each customers as customer}
		<div>
			{customer.company}: Contact: {customer.contact} - {customer.phone}
		</div>
	{/each}
</div>
