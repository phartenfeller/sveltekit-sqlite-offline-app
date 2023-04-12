import type { WorkerMessage, WorkerMessageTypes } from './types';

export type WorkerMsgCb = (data: WorkerMessage<unknown>) => unknown;
const cbMap = new Map<string, WorkerMsgCb>();

let worker: Worker;

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function randomId() {
	let result = '';
	for (let i = 0; i < 10; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}

/**
 * Initialize event listener for messages from worker
 *
 */
export function initMsgBus(_worker: Worker) {
	worker = _worker;

	worker.addEventListener('message', ({ data }: { data: WorkerMessage<unknown> }) => {
		console.log(`Message received from Worker: ${data.messageId} - ${data.type}`, data.data);

		if (cbMap.has(data.messageId)) {
			const cb = cbMap.get(data.messageId) as WorkerMsgCb;
			cbMap.delete(data.messageId);
			cb(data);
		} else {
			console.error(`Could not find callback for message type: ${data.messageId} - ${data.type}`);
		}
	});
}

function addCallback({ messageId, cb }: { messageId: string; cb: WorkerMsgCb }) {
	cbMap.set(messageId, cb);
}

export function sendMsgToWorker({
	storageId,
	type,
	data,
	expectedType
}: {
	storageId: string;
	type: WorkerMessageTypes;
	data: unknown;
	expectedType?: WorkerMessageTypes;
}): Promise<WorkerMessage<unknown>> {
	return new Promise((resolve, reject) => {
		const messageId = `${storageId}-${randomId()}`;

		const cb = (data: WorkerMessage<unknown>) => {
			if (expectedType && data.type !== expectedType) {
				const reason = `Excpected message type ${expectedType} but got: ${data.type}. MessageId: ${messageId}`;
				console.error(reason);
				reject(reason);
			}

			resolve(data);
		};

		addCallback({
			messageId,
			cb
		});

		const msgData = <WorkerMessage<unknown>>{ messageId, storageId, type };
		if (typeof data == 'object') {
			msgData.data = data;
		}

		worker.postMessage(msgData);
	});
}
