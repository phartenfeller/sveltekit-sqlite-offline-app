import type {
	CreateTableRequestData,
	CreateTableResponseData,
	TableExistsResponseData,
	WorkerMessage
} from '../types';
import { db } from './initDb';
import genTabSrc from './util/genTabSrc';
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
