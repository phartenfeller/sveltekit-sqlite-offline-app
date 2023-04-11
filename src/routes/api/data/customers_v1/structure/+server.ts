import { json, type RequestHandler } from '@sveltejs/kit';
import type { TableStructure } from '../../types';

export const GET = (() => {
	// https://localhost:5173/api/data/customers_v1/structure

	const data: TableStructure = {
		columns: [
			{ name: 'id', type: 'string' },
			{ name: 'company', type: 'string' },
			{ name: 'contact', type: 'string' },
			{ name: 'contactTitle', type: 'string' },
			{ name: 'address', type: 'string' },
			{ name: 'city', type: 'string' },
			{ name: 'region', type: 'string' },
			{ name: 'postalCode', type: 'string' },
			{ name: 'country', type: 'string' },
			{ name: 'phone', type: 'string' },
			{ name: 'fax', type: 'string' }
		],
		pkColumn: 'id'
	};
	return json(data);
}) satisfies RequestHandler;
