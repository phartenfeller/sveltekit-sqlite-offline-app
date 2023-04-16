import type { TableStructure } from '../../../../routes/api/data/types';

export default function genInsertSql(storageId: string, structure: TableStructure) {
	let statement = `Insert Into ${storageId} (`;

	const atomics: string[] = [];

	for (const col of structure.columns) {
		atomics.push(col.name);
	}

	statement += `   ${atomics.join(', ')}    ) Values ( ${atomics
		.map((a) => `$${a}`)
		.join(', ')} );`;

	return statement;
}
