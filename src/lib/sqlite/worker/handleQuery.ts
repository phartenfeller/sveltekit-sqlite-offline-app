import getErrorMessage from '$lib/util/getErrorMsg';
import type { DataRow, QueryRequestData, QueryResponseData, WorkerMessage } from '../types';
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
