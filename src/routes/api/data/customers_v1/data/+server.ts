import { getCustomers } from '$lib/server/db';
import { error, json, type RequestHandler } from '@sveltejs/kit';

// https://localhost:5173/api/data/customers_v1/data?offset=0&limit=50
export const GET = (({ url }) => {
	const offset = parseInt(url.searchParams.get('offset') ?? '');
	const limit = parseInt(url.searchParams.get('limit') ?? '');

	if (isNaN(offset) || isNaN(limit)) {
		console.error('Invalid offset or limit', { offset, limit });
		throw error(400, 'Invalid offset or limit');
	}

	const data = getCustomers({ offset, limit });
	return json(data);
}) satisfies RequestHandler;
