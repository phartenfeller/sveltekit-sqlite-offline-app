export type ColumnInfo = {
	name: string;
	type: 'string' | 'number';
};

export type TableStructure = {
	columns: ColumnInfo[];
	pkColumn: string;
};
