import type { TableExistsResponseData, WorkerMessage } from '../types';
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
