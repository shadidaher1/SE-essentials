import { IInitializable, IRepository, id } from "../IRepository";
import { IdetifiableCake } from "../../Model/Cake.Model";
import { ItemCategory } from "../../Model/IItem";
import logger from "../../util/logger";
import { PGConnectionManager } from "../../util/database/PGConnectionManager";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/repositoryExcpetion";
import { SQLiteCake, SQLiteCakeMapper } from "../../mappers/Cake.mapper";

const table_name = ItemCategory.CAKE;

const CREATE_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS ${table_name} (
    "id" TEXT PRIMARY KEY,
    "cakeType" TEXT NOT NULL,
    "flavor" TEXT NOT NULL,
    "filling" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "layers" INTEGER NOT NULL,
    "frostingType" TEXT NOT NULL,
    "frostingFlavor" TEXT NOT NULL,
    "decorationType" TEXT NOT NULL,
    "decorationColor" TEXT NOT NULL,
    "customMessage" TEXT NOT NULL,
    "shape" TEXT NOT NULL,
    "allergies" TEXT NOT NULL,
    "specialIngredients" TEXT NOT NULL,
    "packagingType" TEXT NOT NULL
)`;

const INSERT_CAKE = `INSERT INTO ${table_name} 
    ("id", "cakeType", "flavor", "filling", "size", "layers", 
     "frostingType", "frostingFlavor", "decorationType", "decorationColor", 
     "customMessage", "shape", "allergies", "specialIngredients", "packagingType") 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    ON CONFLICT ("id") DO NOTHING`;

const SELECT_BY_ID = `SELECT "id", "cakeType", "flavor", "filling", "size", "layers", 
    "frostingType", "frostingFlavor", "decorationType", "decorationColor", 
    "customMessage", "shape", "allergies", "specialIngredients", "packagingType" 
    FROM ${table_name} WHERE "id" = $1`;

const SELECT_ALL = `SELECT * FROM ${table_name}`;

const DELETE_ID = `DELETE FROM ${table_name} WHERE "id" = $1`;

const UPDATE_ID = `UPDATE ${table_name} SET 
    "cakeType" = $1, 
    "flavor" = $2, 
    "filling" = $3, 
    "size" = $4, 
    "layers" = $5, 
    "frostingType" = $6, 
    "frostingFlavor" = $7, 
    "decorationType" = $8, 
    "decorationColor" = $9, 
    "customMessage" = $10, 
    "shape" = $11, 
    "allergies" = $12, 
    "specialIngredients" = $13, 
    "packagingType" = $14 
    WHERE "id" = $15`;

export class PGCakeRepository implements IRepository<IdetifiableCake>, IInitializable {

    async init(): Promise<void> {
        try {
            const pool = await PGConnectionManager.getInstance().getConnection();
            await pool.query(CREATE_TABLE_QUERY);
            logger.info("Cake table initialised (PostgreSQL)");
        } catch (error: unknown) {
            logger.error("Failed to initialise cake repository", error as Error);
            throw new InitializationException("Failed to initialise cake repository", error as Error);
        }
    }

    async create(item: IdetifiableCake): Promise<id> {
        try {
            const pool = await PGConnectionManager.getInstance().getConnection();
            await pool.query(INSERT_CAKE, [
                item.getID(),
                item.getCakeType(),
                item.getFlavor(),
                item.getFilling(),
                item.getSize(),
                item.getLayers(),
                item.getFrostingType(),
                item.getFrostingFlavor(),
                item.getDecorationType(),
                item.getDecorationColor(),
                item.getCustomMessage(),
                item.getShape(),
                item.getAllergies(),
                item.getSpecialIngredients(),
                item.getPackagingType()
            ]);
            return item.getID();
        } catch (error: unknown) {
            throw new DbException("Failed to create cake", error as Error);
        }
    }

    async get(id: id): Promise<IdetifiableCake> {
        try {
            const pool = await PGConnectionManager.getInstance().getConnection();
            const result = await pool.query<SQLiteCake>(SELECT_BY_ID, [id]);
            if (result.rows.length === 0) {
                throw new ItemNotFoundException("Cake with id " + id + " not found");
            }
            logger.info("Cake got: %o", result.rows[0]);
            return new SQLiteCakeMapper().map(result.rows[0]);
        } catch (error: unknown) {
            logger.error("Failed to get cake of id %s %o", id, error as Error);
            throw new DbException("Failed to get cake of id " + id, error as Error);
        }
    }

    async getAll(): Promise<IdetifiableCake[]> {
        try {
            const pool = await PGConnectionManager.getInstance().getConnection();
            const result = await pool.query<SQLiteCake>(SELECT_ALL);
            const mapper = new SQLiteCakeMapper();
            return result.rows.map(cake => mapper.map(cake));
        } catch (error: unknown) {
            logger.error("Failed to get all cakes", error as Error);
            throw new DbException("Failed to get all cakes", error as Error);
        }
    }

    async update(item: IdetifiableCake): Promise<void> {
        try {
            const pool = await PGConnectionManager.getInstance().getConnection();
            await pool.query(UPDATE_ID, [
                item.getCakeType(),
                item.getFlavor(),
                item.getFilling(),
                item.getSize(),
                item.getLayers(),
                item.getFrostingType(),
                item.getFrostingFlavor(),
                item.getDecorationType(),
                item.getDecorationColor(),
                item.getCustomMessage(),
                item.getShape(),
                item.getAllergies(),
                item.getSpecialIngredients(),
                item.getPackagingType(),
                item.getID()
            ]);
        } catch (error: unknown) {
            logger.error("Failed to update cake of id %s %o", item.getID(), error as Error);
            throw new DbException("Failed to update cake of id " + item.getID(), error as Error);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const pool = await PGConnectionManager.getInstance().getConnection();
            await pool.query(DELETE_ID, [id]);
        } catch (error: unknown) {
            logger.error("Failed to delete cake of id %s %o", id, error as Error);
            throw new DbException("Failed to delete cake of id " + id, error as Error);
        }
    }
}