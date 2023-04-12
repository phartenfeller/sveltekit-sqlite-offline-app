import type { TableStructure } from '../../routes/api/data/types';

export enum WorkerMessageTypes {
	INIT_DB = 'INIT_DB',
	INIT_DB_RESPONSE = 'INIT_DB_RESPONSE',
	TABLE_EXISTS = 'TABLE_EXISTS',
	TABLE_EXISTS_RESPONSE = 'TABLE_EXISTS_RESPONSE',
	CREATE_TABLE = 'CREATE_TABLE',
	CREATE_TABLE_RESPONSE = 'CREATE_TABLE_RESPONSE'
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

export type CreateTableRequestData = {
	structure: TableStructure;
};

export type CreateTableResponseData = {
	errorMsg?: string;
};
