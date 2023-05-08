import getErrorMessage from '$lib/util/getErrorMsg';
import type {
	DataRow,
	QueryRequestData,
	QueryResponseData,
	QueryStorageRequestData,
	QueryStorageResponseData,
	WorkerMessage
} from '../types';
import { db } from './initDb';

export function handleQuery(msg: WorkerMessage<QueryRequestData>): QueryResponseData {
	try {
		console.log('sql', msg.data);

		let data: DataRow[] = [];

		try {
			db.transaction(() => {
				data = db.selectObjects(msg.data.sql);
				throw new Error('force rollback');
			});
		} catch (err) {
			if (getErrorMessage(err) !== 'force rollback') {
				throw err;
			}
		}

		return {
			rows: data
		};
	} catch (err) {
		const msg = `Error running query: ${err}`;
		console.error(msg);

		return {
			rows: [],
			errorMsg: msg
		};
	}
}

type SQLiteColInfo = {
	cid: number;
	dflt_value: string | null;
	name: string;
	notnull: 0 | 1;
	pk: 0 | 1;
	type: string;
};

function prepareSearchTerm(searchTerm: string, storageId: string) {
	const colInfo = db.selectObjects(`PRAGMA table_info(${storageId});`) as SQLiteColInfo[];

	const coalescedCols = colInfo.map((c) => `coalesce(${c.name}, '')`).join(' || ');

	return {
		where: `where (lower(${coalescedCols}) LIKE $searchTerm)`,
		bindVal: `%${searchTerm.replaceAll('%', '/%').toLowerCase()}%`
	};
}

export function handleStorageQuery(
	msg: WorkerMessage<QueryStorageRequestData>
): QueryStorageResponseData {
	try {
		let sql = `select * from ${msg.storageId} #WHERE# #ORDER_BY# #LIMIT#`;

		if (msg.data.orderByCol) {
			const dir = msg.data.orderByDir?.toLowerCase() === 'desc' ? 'desc' : 'asc';

			sql = sql.replace('#ORDER_BY#', `order by ${msg.data.orderByCol} ${dir}`);
		} else {
			sql = sql.replace('#ORDER_BY#', 'order by 1');
		}

		const binds: { [key: string]: number | string } = {
			$limit: msg.data.limit ?? 999999999
		};

		if (msg.data.offset) {
			sql = sql.replace('#LIMIT#', `limit $limit offset $offset`);
			binds['$offset'] = msg.data.offset;
		} else {
			sql = sql.replace('#LIMIT#', 'limit $limit');
		}

		if (msg.data.searchTerm) {
			const { where, bindVal } = prepareSearchTerm(msg.data.searchTerm, msg.storageId);
			sql = sql.replace('#WHERE#', where);
			binds['$searchTerm'] = bindVal;
		} else {
			sql = sql.replace('#WHERE#', ``);
		}

		console.log('handleStorageQuery sql:', sql, binds);

		const data = db.selectObjects(sql, binds);

		return {
			rows: data
		};
	} catch (err) {
		const errMsg = `Error getting rows for ${msg.storageId}: ${err}`;
		console.error(errMsg);
		return {
			rows: [],
			errorMsg: errMsg
		};
	}
}
