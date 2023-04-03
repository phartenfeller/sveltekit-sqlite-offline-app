/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DB } from 'sqlite3oo1';

const DB_NAME = 'file:///offline-db.sqlite';
export let db: DB;

declare global {
	function sqlite3InitModule(options: { print: object; printErr: object }): Promise<void>;
}

type InitDbReturn = {
	ok: boolean;
	error?: string;
};

export async function initDb(): Promise<InitDbReturn> {
	return new Promise((resolve) => {
		try {
			self
				.sqlite3InitModule({ print: console.log, printErr: console.error })
				.then((sqlite3: any) => {
					try {
						console.log('Initialized sqlite3 module.', sqlite3);
						const oo = sqlite3?.oo1 as any;
						//const opfs = sqlite3?.opfs as any;
						const capi = sqlite3.capi as any;
						const opfsFound = capi.sqlite3_vfs_find('opfs');
						console.log(
							'sqlite3 version',
							capi.sqlite3_libversion(),
							capi.sqlite3_sourceid(),
							`OPFS? ==> ${opfsFound}`
						);
						if (opfsFound) {
							db = new oo.OpfsDb(DB_NAME) as DB;
							console.log('The OPFS is available.');
						} else {
							db = new oo.DB(DB_NAME, 'ct') as DB;
							console.log('The OPFS is not available.');
						}
						console.log('transient db =', (db as any).filename);

						// optimize for speed (with safety): https://cj.rs/blog/sqlite-pragma-cheatsheet-for-performance-and-consistency/
						db.exec(['PRAGMA journal_mode = wal;', 'PRAGMA synchronous = normal;']);

						resolve({ ok: true });
					} catch (e: any) {
						console.error(`Could not initialize database: ${e.message}`);
						resolve({ ok: false, error: e.message });
					}
				});
		} catch (e: any) {
			console.error(`Could not initialize database: ${e.message}`);
			resolve({ ok: false, error: e.message });
		}
	});
}
