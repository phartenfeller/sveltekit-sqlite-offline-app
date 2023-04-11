export enum WorkerMessageTypes {
	INIT_DB,
	INIT_DB_RESPONSE
}

export type WorkerMessageBase = {
	messageId: string;
	type: WorkerMessageTypes;
	storageId: string;
};

export type WorkerMessage<T> = { data: T } & WorkerMessageBase;
