import type { WorkerMessage } from '../types';

console.log('worker loaded');

(async function () {
	addEventListener('message', async function ({ data }: { data: WorkerMessage }) {
		console.log('worker received message:', data.message);

		const res: WorkerMessage = { message: 'xyz' };
		console.log('worker sending message back to main:', res);
		this.postMessage(res);
	});
})();
