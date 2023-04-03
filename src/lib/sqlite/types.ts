export enum WorkerMessageTypes {
	INIT_DB,
	INIT_DB_RESPONSE
}

export type WorkerMessage = {
	type: WorkerMessageTypes;
};
