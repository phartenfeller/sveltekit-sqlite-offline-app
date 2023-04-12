import { db } from '../initDb';

export function tableExists(table: string) {
	const sql = `SELECT count(*) as "cnt" FROM sqlite_master WHERE type='table' AND name= $table`;

	const res = db.selectObject(sql, {
		$table: table
	}) as { cnt: number };

	return res.cnt > 0;
}

export function tableHasData(table: string) {
	const sql = `SELECT count(*) as "cnt" FROM ${table}`;

	const res = db.selectObject(sql) as { cnt: number };

	return res.cnt > 0;
}
