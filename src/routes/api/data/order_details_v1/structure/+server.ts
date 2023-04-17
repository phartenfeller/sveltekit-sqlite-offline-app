import { json, type RequestHandler } from '@sveltejs/kit';
import type { TableStructure } from '../../types';

export const GET = (() => {
	// https://localhost:5173/api/data/customers_v1/structure

	const data: TableStructure = {
		columns: [
			{ name: 'id', type: 'number' },
			{ name: 'orderId', type: 'number' },
			{ name: 'productId', type: 'number' },
			{ name: 'unitPrice', type: 'number' },
			{ name: 'quantity', type: 'number' },
			{ name: 'discount', type: 'number' }
		],
		pkColumn: 'id'
	};
	return json(data);
}) satisfies RequestHandler;
