import type { TableStructure } from '../../routes/api/data/types';

export enum WorkerMessageTypes {
	INIT_DB = 'INIT_DB',
	INIT_DB_RESPONSE = 'INIT_DB_RESPONSE',
	TABLE_EXISTS = 'TABLE_EXISTS',
	TABLE_EXISTS_RESPONSE = 'TABLE_EXISTS_RESPONSE',
	CREATE_TABLE = 'CREATE_TABLE',
	CREATE_TABLE_RESPONSE = 'CREATE_TABLE_RESPONSE',
	FILL_STORAGE = 'FILL_STORAGE',
	FILL_STORAGE_RESPONSE = 'FILL_STORAGE_RESPONSE',
	QUERY = 'QUERY',
	QUERY_RESPONSE = 'QUERY_RESPONSE',
	QUERY_STORAGE = 'QUERY_STORAGE',
	QUERY_STORAGE_RESPONSE = 'QUERY_STORAGE_RESPONSE'
}

export type DataRow = { [key: string]: string | number | boolean | null };

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

export type FillStorageRequestData = {
	structure: TableStructure;
	rows: DataRow[];
};

export type FillStorageResponseData = {
	errorMsg?: string;
};

export type QueryRequestData = {
	sql: string;
};

export type QueryResponseData = {
	rows: DataRow[];
	errorMsg?: string;
};

export type OrderByDir = 'asc' | 'desc';

export type QueryStorageRequestData = {
	offset?: number;
	limit?: number;
	orderByCol?: string;
	orderByDir?: OrderByDir;
	searchTerm?: string;
};

export type QueryStorageResponseData = {
	rows: DataRow[];
	errorMsg?: string;
};
