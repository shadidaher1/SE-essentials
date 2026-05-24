import { IIdentifiableOrderItem } from "../../Model/IOrder";
import { id, IInitializable, IRepository } from "../IRepository";
import logger from "../../util/logger";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/repositoryExcpetion";
import { PGConnectionManager } from "../../util/database/PGConnectionManager";
import { IIdentifiableItem } from "../../Model/IItem";
import { SQLiteOrder, SQLiteOrderMapper } from "../../mappers/Order.mapper";

const CREATE_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS "orders" (
    id TEXT PRIMARY KEY,
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL,
    item_category TEXT NOT NULL,
    item_id TEXT NOT NULL
)`;

    const INSERT_ORDER_QUERY = `INSERT INTO "orders" (id, quantity, price, item_category, item_id) 
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (id) DO NOTHING`;

const SELECT_ORDER_QUERY = `SELECT id, quantity, price, item_category, item_id FROM "orders" WHERE id = $1`;

const SELECT_ALL_ORDERS_QUERY = `SELECT * FROM "orders" WHERE item_category = $1`;

const DELETE_ID = `DELETE FROM "orders" WHERE id = $1`;

const UPDATE_ID = `UPDATE "orders" SET 
    quantity = $1, 
    price = $2, 
    item_category = $3, 
    item_id = $4 
    WHERE id = $5`;

export class PGOrderRepository implements IRepository<IIdentifiableOrderItem>, IInitializable {

    constructor(private readonly itemRepository: IRepository<IIdentifiableItem> & IInitializable) { }

    async init(): Promise<void> {
        try {
            const pool = await PGConnectionManager.getInstance().getConnection();
            await pool.query(CREATE_TABLE_QUERY);
            await this.itemRepository.init();
            logger.info("Order table initialised (PostgreSQL)");
        } catch (error: unknown) {
            logger.error("Failed to initialise order repository", error as Error);
            throw new InitializationException("Failed to initialise order repository", error as Error);
        }
    }

    async create(item: IIdentifiableOrderItem): Promise<id> {
        const pool = await PGConnectionManager.getInstance().getConnection();
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            const item_id = await this.itemRepository.create(item.getItem() as IIdentifiableItem);
            await client.query(INSERT_ORDER_QUERY, [
                item.getID(),
                item.getQuantity(),
                item.getPrice(),
                item.getItem().getCategory(),
                item_id
            ]);
            await client.query("COMMIT");
            return item.getID();
        } catch (error: unknown) {
            await client.query("ROLLBACK");
            logger.error("Failed to create order", error as Error);
            throw new DbException("Failed to create order", error as Error);
        } finally {
            client.release();  // always release client back to pool
        }
    }

    async get(id: id): Promise<IIdentifiableOrderItem> {
        try {
            const pool = await PGConnectionManager.getInstance().getConnection();
            const result = await pool.query<SQLiteOrder>(SELECT_ORDER_QUERY, [id]);
            if (result.rows.length === 0) {
                throw new ItemNotFoundException("Order not found");
            }
            const order = result.rows[0];
            const item = await this.itemRepository.get(order.item_id);
            logger.info("Order got: %o", order);
            return new SQLiteOrderMapper().map({ data: order, item: item });
        } catch (error: unknown) {
            logger.error("Failed to get order", error as Error);
            throw new DbException("Failed to get order", error as Error);
        }
    }

    async getAll(): Promise<IIdentifiableOrderItem[]> {
        try {
            const pool = await PGConnectionManager.getInstance().getConnection();
            const items = await this.itemRepository.getAll();
            if (items.length === 0) {
                return [];
            }
            const result = await pool.query<SQLiteOrder>(SELECT_ALL_ORDERS_QUERY, [items[0].getCategory()]);
            const orders = result.rows;

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

            return identifiableOrders;

        } catch (error: unknown) {
            logger.error("Failed to get all orders", error as Error);
            throw new DbException("Failed to get all orders", error as Error);
        }
    }

    async update(order: IIdentifiableOrderItem): Promise<void> {
        const pool = await PGConnectionManager.getInstance().getConnection();
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            await this.itemRepository.update(order.getItem() as IIdentifiableItem);
            await client.query(UPDATE_ID, [
                order.getQuantity(),
                order.getPrice(),
                order.getItem().getCategory(),
                order.getItem().getID(),
                order.getID()
            ]);
            await client.query("COMMIT");
        } catch (error: unknown) {
            await client.query("ROLLBACK");
            logger.error("Failed to update order", error as Error);
            throw new DbException("Failed to update order", error as Error);
        } finally {
            client.release();
        }
    }

    async delete(id: id): Promise<void> {
        const pool = await PGConnectionManager.getInstance().getConnection();
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            await this.itemRepository.delete(id);
            await client.query(DELETE_ID, [id]);
            await client.query("COMMIT");
        } catch (error: unknown) {
            await client.query("ROLLBACK");
            logger.error("Failed to delete order", error as Error);
            throw new DbException("Failed to delete order", error as Error);
        } finally {
            client.release();
        }
    }
}