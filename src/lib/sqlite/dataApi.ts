import { waitTillStroageReady } from './initStorages';
import { sendMsgToWorker } from './messageBus';
import {
	WorkerMessageTypes,
	type DataRow,
	type QueryRequestData,
	type QueryResponseData,
	type QueryStorageRequestData,
	type QueryStorageResponseData
} from './types';

export async function runQuery(sql: string): Promise<DataRow[]> {
	const res = await sendMsgToWorker({
		storageId: 'generic',
		type: WorkerMessageTypes.QUERY,
		data: {
			sql: sql
		} as QueryRequestData,
		expectedType: WorkerMessageTypes.QUERY_RESPONSE
	});

	const data = res.data as QueryResponseData;

	if (data?.errorMsg) throw new Error(data.errorMsg);

	return data.rows;
}

export async function runStorageQuery(storageId: string, args: QueryStorageRequestData) {
	await waitTillStroageReady(storageId);

	const res = await sendMsgToWorker({
		storageId: storageId,
		type: WorkerMessageTypes.QUERY_STORAGE,
		data: args,
		expectedType: WorkerMessageTypes.QUERY_STORAGE_RESPONSE
	});

	const data = res.data as QueryStorageResponseData;

	if (data?.errorMsg) throw new Error(data.errorMsg);

	return data.rows;
}
