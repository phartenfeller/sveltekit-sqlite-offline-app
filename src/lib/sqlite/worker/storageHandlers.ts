import type {
	CreateTableRequestData,
	CreateTableResponseData,
	FillStorageRequestData,
	FillStorageResponseData,
	TableExistsResponseData,
	WorkerMessage
} from '../types';
import { db } from './initDb';
import genInsertSql from './util/genInsertSql';
import genTabSrc from './util/genTabSrc';
import getBindObject from './util/getBindObject';
import { tableExists, tableHasData } from './util/tableInfo';

export function handleTableExists(data: WorkerMessage<unknown>): TableExistsResponseData {
	try {
		const { storageId } = data;

		const resData = <TableExistsResponseData>{};
		resData.tableExists = tableExists(storageId);

		if (resData.tableExists) {
			resData.hasData = tableHasData(storageId);
		} else {
			resData.hasData = false;
		}

		return resData;
	} catch (err) {
		const msg = `Error checking if table exists: ${err}`;
		console.error(msg);

		return {
			tableExists: false,
			hasData: false,
			errorMsg: msg
		};
	}
}

export function handleCreateTable(
	msg: WorkerMessage<CreateTableRequestData>
): CreateTableResponseData {
	try {
		const src = genTabSrc(msg.storageId, msg.data.structure);
		console.log('Creating table:', src);

		db.exec(src);

		return {};
	} catch (err) {
		const msg = `Error creating table: ${err}`;
		console.error(msg);

		return {
			errorMsg: msg
		};
	}
}

export function handleFillStorage(
	msg: WorkerMessage<FillStorageRequestData>
): FillStorageResponseData {
	try {
		const { storageId, data } = msg;
		const { rows, structure } = data;

		const src = genInsertSql(storageId, structure);
		console.log('Insert sql:', src);

		for (const row of rows) {
			db.exec({ sql: src, bind: getBindObject(row) });
		}

		return {};
	} catch (err) {
		const msg = `Error filling storage: ${err}`;
		console.error(msg);

		return {
			errorMsg: msg
		};
	}
}
