import Database from 'better-sqlite3';

const db = new Database('./data/northwind.sqlite', { verbose: console.log });

export type Customer = {
	id: string;
	company: string;
	contact: string;
	contactTitle: string;
	address: string;
	city: string;
	region: string;
	postalCode: string;
	country: string;
	phone: string;
	fax: string;
};

type QueryWrapper = {
	moreRows: boolean;
};

export type QueryResult<T> = { data: T } & QueryWrapper;

export function getCustomers({ offset = 0, limit = 50 }): QueryResult<Customer[]> {
	const stmt = db.prepare(`
  SELECT CustomerID as "id"
       , CompanyName as "company"
       , ContactName as "contact"
       , ContactTitle as "contactTitle"
       , Address as "address"
       , City as "city"
       , Region as "region"
       , PostalCode as "postalCode"
       , Country  as "country"
       , Phone as "phone"
       , Fax as "fax"
    FROM customers LIMIT $limit OFFSET $offset`);
	const data = stmt.all({ limit, offset }) as Customer[];

	return {
		data,
		moreRows: data.length === limit
	};
}
