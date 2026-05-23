import { IIdentifiableOrderItem } from "../../Model/IOrder";
import { id, IInitializable, IRepository } from "../IRepository";
import logger from "../../util/logger";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/repositoryExcpetion";
import { ConnectionManager } from "../../util/database/ConnectionManager";
import { IIdentifiableItem } from "../../Model/IItem";
import { SQLiteOrder, SQLiteOrderMapper } from "../../mappers/Order.mapper";


const CREATE_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS "orders" (
    id TEXT PRIMARY KEY,
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL,
    item_category TEXT NOT NULL,
    item_id TEXT NOT NULL
)`;
const INSERT_ORDER_QUERY = `INSERT OR REPLACE INTO "orders" (id, quantity, price, item_category, item_id) VALUES (?, ?, ?, ?, ?)`;
const INSERT_ORDER_LEGACY_QUERY = `INSERT OR REPLACE INTO "orders" (id, quantity, price, item_category, item_id, customer_name, cake_type, order_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
const SELECT_ORDER_QUERY = `SELECT id, quantity, price, item_category, item_id FROM "orders" WHERE id = ?`;

const SELECT_ALL_ORDERS_QUERY = `SELECT * FROM "orders" WHERE item_category = ? `;

const DELETE_ID = `DELETE FROM "orders" WHERE id = ?`;

const UPDATE_ID = `UPDATE "orders" SET quantity = ?, price = ?, item_category = ?, item_id = ? WHERE id = ?`;

export class OrderRepository implements IRepository<IIdentifiableOrderItem>, IInitializable {

    constructor(private readonly itemRepository: IRepository<IIdentifiableItem> & IInitializable) { }
    async init() {
        try {
            const db = await ConnectionManager.getInstance().getConnection();
            await db.exec(CREATE_TABLE_QUERY);
            await this.itemRepository.init();
            logger.info("Order table intitalised");
        }
        catch (error: unknown) {
            logger.error("Failed to initialise order repository", error as Error);
            throw new InitializationException("Failed to initialise order repository", error as Error);
        }
    }
    async create(item: IIdentifiableOrderItem): Promise<id> {
       let conn;
        try {
             conn = await ConnectionManager.getInstance().getConnection();
            await conn.exec("BEGIN TRANSACTION");
            const item_id = await this.itemRepository.create(item.getItem() as IIdentifiableItem);
            try {
                await conn.run(INSERT_ORDER_QUERY, [
                    item.getID(),
                    item.getQuantity(),
                    item.getPrice(),
                    item.getItem().getCategory(),
                    item_id
                ]);
            } catch {
                // Support old DBs that still require legacy NOT NULL columns.
                await conn.run(INSERT_ORDER_LEGACY_QUERY, [
                    item.getID(),
                    item.getQuantity(),
                    item.getPrice(),
                    item.getItem().getCategory(),
                    item_id,
                    "",
                    "",
                    ""
                ]);
            }
            await conn.exec("COMMIT");
            return item.getID();
            // insert data into order table
            // insert data into items table
            // commit
            // return order id
            // if error log and rollback
            // return item.id;
        }
        catch (error: unknown) {
            logger.error("Failed to create order", error as Error);
            if (conn) {
                await conn.exec("ROLLBACK");
            }
            throw new DbException("Failed to create order", error as Error);
        }
    }
   async get(id: id): Promise<IIdentifiableOrderItem> {
        try {
            const conn = await ConnectionManager.getInstance().getConnection();
            const order = await conn.get<SQLiteOrder>(SELECT_ORDER_QUERY, [id]);
            if (!order) {
                throw new ItemNotFoundException("Order not found");
            }
           const item = await this.itemRepository.get(order.item_id);
            logger.info("Order got: %o", order);
            return new SQLiteOrderMapper().map({data: order, item: item});
        }
        catch (error: unknown) {
            logger.error("Failed to get order", error as Error);
            throw new DbException("Failed to get order", error as Error);
        }
    }
   async getAll(): Promise<IIdentifiableOrderItem[]> {
    try {
        const conn = await ConnectionManager.getInstance().getConnection();
        const items = await this.itemRepository.getAll();
        if (items.length === 0) {
            return [];
        }
        const orders = await conn.all<SQLiteOrder[]>(SELECT_ALL_ORDERS_QUERY, items[0].getCategory());
        
        // bind orders to items
        const bindedOrders = orders.map((order) => {
            const item = items.find((item) => item.getID() === order.item_id);
            if (!item) {
                throw new DbException("Item not found for order of id " + order.id, new Error("Item not found"));
            }
            return { order, item };
        });

        // for each binded order and item, map it into an identifiable order
        const mapper = new SQLiteOrderMapper();
        const identifiableOrders = bindedOrders.map(({ order, item }) => {
            return mapper.map({ data: order, item });
        });

        // return list of identifiable orders
        return identifiableOrders;

    } catch (error) {
        logger.error("Failed to get order of id ", error as Error);
        throw new DbException("Failed to get order of id ",  error as Error);
    }
}
    async update(order: IIdentifiableOrderItem): Promise<void> {
        try{
            const conn = await ConnectionManager.getInstance().getConnection();
            await conn.exec("BEGIN TRANSACTION");
            await this.itemRepository.update(order.getItem() as IIdentifiableItem);
            await conn.run(UPDATE_ID, [
                order.getQuantity(),
                order.getPrice(),
                order.getItem().getCategory(),
                order.getItem().getID(),
                order.getID()
            ]);
            await conn.exec("COMMIT");
        }
        catch (error: unknown) {
            logger.error("Failed to update order", error as Error);
            throw new DbException("Failed to update order", error as Error);
        }
    }
   async delete(id: id): Promise<void> {
        try {
        const conn = await ConnectionManager.getInstance().getConnection();
            await conn.exec("BEGIN TRANSACTION");
           await this.itemRepository.delete(id);
           await conn.run(DELETE_ID, [id]);
            await conn.exec("COMMIT");
        }
        catch (error: unknown) {
            logger.error("Failed to delete order", error as Error);
            throw new DbException("Failed to delete order", error as Error);
        }
    }
}
