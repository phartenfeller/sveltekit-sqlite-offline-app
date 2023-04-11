/* eslint-disable no-case-declarations */
import { WorkerMessageTypes, type WorkerMessage, type TableExistsResponseData } from '../types';
import { initDb } from './initDb';
import { handleTableExists } from './storageHandlers';

console.log('worker loaded');

function sendMsgToMain(obj: WorkerMessage<unknown>) {
	postMessage(obj);
}

(async function () {
	addEventListener('message', async function ({ data }: { data: WorkerMessage<unknown> }) {
		console.log('worker received message:', data.type);

		switch (data.type) {
			case WorkerMessageTypes.INIT_DB:
				await import('../jswasm/sqlite3.mjs');

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

			default:
				throw new Error(`Unknown message type: ${data.type}`);
		}
	});
})();
