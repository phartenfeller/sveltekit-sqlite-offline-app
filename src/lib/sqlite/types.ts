export enum WorkerMessageTypes {
	INIT_DB,
	INIT_DB_RESPONSE,
	TABLE_EXISTS,
	TABLE_EXISTS_RESPONSE
}

export type WorkerMessageBase = {
	messageId: string;
	type: WorkerMessageTypes;
	storageId: string;
};

export type WorkerMessage<T> = { data: T } & WorkerMessageBase;

export type TableExistsResponseData = {
	tableExists: boolean;
	hasData: boolean;
	errorMsg?: string;
};
