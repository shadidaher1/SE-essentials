import { SQLiteToy, SQLiteToyMapper } from "../../mappers/Toy.mapper";
import { ItemCategory } from "../../Model/IItem";
import { IdetifiableToy } from "../../Model/Toy.Model";
import { PGConnectionManager } from "../../util/database/PGConnectionManager";
import { DbException, InitializationException } from "../../util/exceptions/repositoryExcpetion";
import logger from "../../util/logger";
import { IInitializable, IRepository } from "../IRepository";

const tableName = ItemCategory.TOY;

const CREATE_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS ${tableName} (
    "id" TEXT PRIMARY KEY,
    "toyType" TEXT NOT NULL,
    "ageGroup" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "batteryRequired" TEXT NOT NULL,
    "educational" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "quantity" INTEGER NOT NULL
)`;

const INSERT_TOY_QUERY = `INSERT INTO ${tableName} 
    ("id", "toyType", "ageGroup", "brand", "material", "batteryRequired", "educational", "price", "quantity") 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    ON CONFLICT ("id") DO NOTHING`;

const SELECT_BY_ID = `SELECT * FROM ${tableName} WHERE "id" = $1`;

const SELECT_ALL = `SELECT * FROM ${tableName}`;

const DELETE_ID = `DELETE FROM ${tableName} WHERE "id" = $1`;

const UPDATE_ID = `UPDATE ${tableName} SET
    "toyType" = $1,
    "ageGroup" = $2,
    "brand" = $3,
    "material" = $4,
    "batteryRequired" = $5,
    "educational" = $6,
    "price" = $7,
    "quantity" = $8
WHERE "id" = $9`;

export class PGToyRepository implements IRepository<IdetifiableToy>, IInitializable {

    async init(): Promise<void> {
        try {
            const pool = await PGConnectionManager.getInstance().getConnection();
            await pool.query(CREATE_TABLE_QUERY);
            logger.info("Toy table initialised (PostgreSQL)");
        } catch (error: unknown) {
            logger.error("Failed to initialise toy repository", error as Error);
            throw new InitializationException("Failed to initialise toy repository", error as Error);
        }
    }

    async create(item: IdetifiableToy): Promise<string> {
        try {
            const pool = await PGConnectionManager.getInstance().getConnection();
            await pool.query(INSERT_TOY_QUERY, [
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
        } catch (error: unknown) {
            logger.error("Failed to create toy", error as Error);
            throw new DbException("Failed to create toy", error as Error);
        }
    }

    async get(id: string): Promise<IdetifiableToy> {
        try {
            const pool = await PGConnectionManager.getInstance().getConnection();
            const result = await pool.query<SQLiteToy>(SELECT_BY_ID, [id]);
            if (result.rows.length === 0) {
                throw new Error(`Toy with id ${id} not found`);
            }
            logger.info(`Toy with id ${id} retrieved`);
            return new SQLiteToyMapper().map(result.rows[0]);
        } catch (error: unknown) {
            logger.error(`Failed to retrieve toy with id ${id}`, error as Error);
            throw new DbException("Failed to retrieve toy", error as Error);
        }
    }

    async getAll(): Promise<IdetifiableToy[]> {
        try {
            const pool = await PGConnectionManager.getInstance().getConnection();
            const result = await pool.query<SQLiteToy>(SELECT_ALL);
            logger.info(`All toys retrieved, count: ${result.rows.length}`);
            return result.rows.map(row => new SQLiteToyMapper().map(row));
        } catch (error: unknown) {
            logger.error("Failed to retrieve all toys", error as Error);
            throw new DbException("Failed to retrieve all toys", error as Error);
        }
    }

    async update(item: IdetifiableToy): Promise<void> {
        try {
            const pool = await PGConnectionManager.getInstance().getConnection();
            await pool.query(UPDATE_ID, [
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
            const pool = await PGConnectionManager.getInstance().getConnection();
            await pool.query(DELETE_ID, [id]);
            logger.info(`Toy with id ${id} deleted`);
        } catch (error: unknown) {
            logger.error(`Failed to delete toy with id ${id}`, error as Error);
            throw new DbException("Failed to delete toy", error as Error);
        }
    }
}