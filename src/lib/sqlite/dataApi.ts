import { sendMsgToWorker } from './messageBus';
import {
	WorkerMessageTypes,
	type DataRow,
	type QueryRequestData,
	type QueryResponseData
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
