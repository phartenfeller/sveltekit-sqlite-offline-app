import initStorages from './initStorages';
import { initMsgBus, sendMsgToWorker } from './messageBus';
import { WorkerMessageTypes } from './types';

const workerImp = await import('./worker/worker.ts?worker');

export default async function initWorker() {
	const worker = new workerImp.default();
	initMsgBus(worker);

	const res = await sendMsgToWorker({
		storageId: 'db',
		type: WorkerMessageTypes.INIT_DB,
		expectedType: WorkerMessageTypes.INIT_DB_RESPONSE,
		data: undefined
	});

	console.log('Init worker response:', res);

	initStorages();
}
