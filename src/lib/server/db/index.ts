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

export type OrderDetail = {
	id: number;
	orderId: number;
	productId: number;
	unitPrice: number;
	quantity: number;
	discount: number;
};

type QueryWrapper = {
	moreRows: boolean;
};

export type QueryResult<T> = { data: T } & QueryWrapper;

export function getCustomerCount(): number {
	const stmt = db.prepare(`SELECT COUNT(*) as "cnt" FROM customers`);
	const data = stmt.get() as { cnt: number };
	return data.cnt;
}

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
		moreRows: getCustomerCount() > offset + limit
	};
}

export function getOrderDetailCount(): number {
	const stmt = db.prepare(`SELECT COUNT(*) as "cnt" FROM "Order Details"`);
	const data = stmt.get() as { cnt: number };
	return data.cnt;
}

export function getOrderDetails({ offset = 0, limit = 50 }): QueryResult<OrderDetail[]> {
	const stmt = db.prepare(`
  SELECT ROWID as "id"
	     , OrderId as "orderId"
       , ProductId as "productId"
       , UnitPrice as "unitPrice"
       , Quantity as "quantity"
       , Discount as "discount"
    FROM "Order Details" LIMIT $limit OFFSET $offset`);
	const data = stmt.all({ limit, offset }) as OrderDetail[];

	return {
		data,
		moreRows: getOrderDetailCount() > offset + limit
	};
}
