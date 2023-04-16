import type { DataRow } from '$lib/sqlite/types';

export default function getBindObject(data: DataRow): DataRow {
	const bindObject: DataRow = {};

	for (const key in data) {
		bindObject[`$${key}`] = data[key];
	}

	return bindObject;
}
