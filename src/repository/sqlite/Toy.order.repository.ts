import { log } from "node:console";
import { SQLiteToy, SQLiteToyMapper } from "../../mappers/Toy.mapper";
import { ItemCategory } from "../../Model/IItem";
import { IdetifiableToy } from "../../Model/Toy.Model";
import { ConnectionManager } from "../../util/database/ConnectionManager";
import { DbException, InitializationException } from "../../util/exceptions/repositoryExcpetion";
import logger from "../../util/logger";
import { IInitializable, IRepository } from "../IRepository";




const tableName = ItemCategory.TOY;

const CREATE_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS ${tableName} (
    id TEXT PRIMARY KEY,
    toyType TEXT NOT NULL,
    ageGroup TEXT NOT NULL,
    brand TEXT NOT NULL,
    material TEXT NOT NULL,
    batteryRequired TEXT NOT NULL,
    educational TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL
)`;

const INSERT_TOY_QUERY = `INSERT OR IGNORE INTO ${tableName} 
    (id, toyType, ageGroup, brand, material, batteryRequired, educational, price, quantity) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

const SELECT_BY_ID = `SELECT id, toyType, ageGroup, brand, material, batteryRequired, educational, price, quantity 
    FROM ${tableName} WHERE id = ?`;

const SELECT_ALL = `SELECT * FROM ${tableName}`;

const DELETE_ID = `DELETE FROM ${tableName} WHERE id = ?`;

const UPDATE_ID = `UPDATE ${tableName} SET
    toyType = ?,
    ageGroup = ?,
    brand = ?,
    material = ?,
    batteryRequired = ?,
    educational = ?,
    price = ?,
    quantity = ?
WHERE id = ?`;


export class ToyRepository implements IRepository<IdetifiableToy>, IInitializable {

    async init(): Promise<void> {
        try {
            const conn = await ConnectionManager.getInstance().getConnection();
            await conn.exec(CREATE_TABLE_QUERY);
            logger.info("Toy table initialised");
        }
        catch (error: unknown) {
            logger.error("Failed to initialise toy repository", error as Error);
            throw new InitializationException("Failed to initialise toy repository", error as Error);
        }
    }

    async create(item: IdetifiableToy): Promise<string> {
        try{
        const conn = await ConnectionManager.getInstance().getConnection();
        await conn.run(INSERT_TOY_QUERY, [
            item.getID(),
            item.getToyType(),
            item.getAgeGroup(),
            item.getBrand(),
            item.getMaterial(),
            item.getBatteryRequired(),
            item.getEducational(),
            item.getPrice(),
            item.getQuantity()
        ]);
        return item.getID();
    }
    catch (error: unknown) {
        logger.error("Failed to create toy", error as Error);
        throw new DbException("Failed to create toy", error as Error);
    }
    }

    async get(id: string): Promise<IdetifiableToy> {
        try {
        const conn = await ConnectionManager.getInstance().getConnection();
        const row = await conn.get<SQLiteToy>(SELECT_BY_ID, [id]);
        if (!row) {
            throw new Error(`Toy with id ${id} not found`);
        }
        logger.info(`Toy with id ${id} retrieved`);
        return new SQLiteToyMapper().map(row);
        } catch (error: unknown) {
            logger.error(`Failed to retrieve toy with id ${id}`, error as Error);
            throw new DbException("Failed to retrieve toy", error as Error);
        }
    }

    async getAll(): Promise<IdetifiableToy[]> {
        try {
        const conn = await ConnectionManager.getInstance().getConnection();
        const rows = await conn.all<SQLiteToy[]>(SELECT_ALL);
        logger.info(`All toys retrieved, count: ${rows.length}`);
        return rows.map(row => new SQLiteToyMapper().map(row));
        } catch (error: unknown) {
            logger.error("Failed to retrieve all toys", error as Error);
            throw new DbException("Failed to retrieve all toys", error as Error);
        }
    }

    async update(item: IdetifiableToy): Promise<void> {
        try {
        const conn = await ConnectionManager.getInstance().getConnection();
        await conn.run(UPDATE_ID, [
            item.getToyType(),
            item.getAgeGroup(),
            item.getBrand(),
            item.getMaterial(),
            item.getBatteryRequired(),
            item.getEducational(),
            item.getPrice(),
            item.getQuantity(),
            item.getID()
        ]);
        logger.info(`Toy with id ${item.getID()} updated`);
        } catch (error: unknown) {
            logger.error(`Failed to update toy with id ${item.getID()}`, error as Error);
            throw new DbException("Failed to update toy", error as Error);
        }
    }

    async delete(id: string): Promise<void> {
        try {
        const conn = await ConnectionManager.getInstance().getConnection();
        await conn.run(DELETE_ID, [id]);
        logger.info(`Toy with id ${id} deleted`);
        } catch (error: unknown) {
            logger.error(`Failed to delete toy with id ${id}`, error as Error);
            throw new DbException("Failed to delete toy", error as Error);
        }
    }
}
