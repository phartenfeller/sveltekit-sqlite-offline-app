/* eslint-disable no-case-declarations */
import {
	WorkerMessageTypes,
	type WorkerMessage,
	type TableExistsResponseData,
	type CreateTableResponseData,
	type CreateTableRequestData,
	type FillStorageRequestData,
	type FillStorageResponseData,
	type QueryRequestData,
	type QueryResponseData
} from '../types';
import { handleQuery } from './handleQuery';
import { initDb } from './initDb';
import { handleCreateTable, handleFillStorage, handleTableExists } from './storageHandlers';

console.log('worker loaded');

function sendMsgToMain(obj: WorkerMessage<unknown>) {
	postMessage(obj);
}

(async function () {
	addEventListener('message', async function ({ data }: { data: WorkerMessage<unknown> }) {
		console.log('worker received message:', data);

		switch (data.type) {
			case WorkerMessageTypes.INIT_DB:
				await import('../jswasm/sqlite3-bundler-friendly.mjs');

				const initRes = await initDb();
				console.log('worker initDb result:', initRes);

				const initResult: WorkerMessage<undefined> = {
					type: WorkerMessageTypes.INIT_DB_RESPONSE,
					messageId: data.messageId,
					storageId: data.storageId,
					data: undefined
				};
				sendMsgToMain(initResult);

				break;

			case WorkerMessageTypes.TABLE_EXISTS:
				const tableExistData = handleTableExists(data);

				const tableExistsResult: WorkerMessage<TableExistsResponseData> = {
					type: WorkerMessageTypes.TABLE_EXISTS_RESPONSE,
					messageId: data.messageId,
					storageId: data.storageId,
					data: tableExistData
				};
				sendMsgToMain(tableExistsResult);
				break;

			case WorkerMessageTypes.CREATE_TABLE:
				const createTableData = await handleCreateTable(
					data as WorkerMessage<CreateTableRequestData>
				);

				const createTableResult: WorkerMessage<CreateTableResponseData> = {
					type: WorkerMessageTypes.CREATE_TABLE_RESPONSE,
					messageId: data.messageId,
					storageId: data.storageId,
					data: createTableData
				};
				sendMsgToMain(createTableResult);
				break;

			case WorkerMessageTypes.FILL_STORAGE:
				const fillStorageData = await handleFillStorage(
					data as WorkerMessage<FillStorageRequestData>
				);

				const fillStorageResult: WorkerMessage<FillStorageResponseData> = {
					type: WorkerMessageTypes.FILL_STORAGE_RESPONSE,
					messageId: data.messageId,
					storageId: data.storageId,
					data: fillStorageData
				};

				sendMsgToMain(fillStorageResult);
				break;

			case WorkerMessageTypes.QUERY:
				const queryData = await handleQuery(data as WorkerMessage<QueryRequestData>);
				const queryResult: WorkerMessage<QueryResponseData> = {
					type: WorkerMessageTypes.QUERY_RESPONSE,
					messageId: data.messageId,
					storageId: data.storageId,
					data: queryData
				};

				sendMsgToMain(queryResult);
				break;

			default:
				throw new Error(`Unknown message type: ${data.type}`);
		}
	});
})();
