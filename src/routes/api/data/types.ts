export type ColType = 'string' | 'number';

export type ColumnInfo = {
	name: string;
	type: ColType;
};

export type TableStructure = {
	columns: ColumnInfo[];
	pkColumn: string;
};
