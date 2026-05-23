

import { IInitializable, IRepository, id } from "../IRepository";
import { IdetifiableCake } from "../../Model/Cake.Model";
import { IItem, IIdentifiableItem, ItemCategory } from "../../Model/IItem";
import { Database } from "sqlite3";
import { Database as SQLiteDatabase } from "sqlite";
import { open } from "sqlite";
import config from "../../config";
import logger from "../../util/logger";
import { ConnectionManager } from "../../util/database/ConnectionManager";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/repositoryExcpetion";
import { SQLiteCake, SQLiteCakeMapper } from "../../mappers/Cake.mapper";

const table_name = ItemCategory.CAKE;

const CREATE_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS ${table_name} (
        id TEXT PRIMARY KEY,
        cakeType TEXT NOT NULL,
        flavor TEXT NOT NULL,
        filling TEXT NOT NULL,
        size INTEGER NOT NULL,
        layers INTEGER NOT NULL,
        frostingType TEXT NOT NULL,
        frostingFlavor TEXT NOT NULL,
        decorationType TEXT NOT NULL,
        decorationColor TEXT NOT NULL,
        customMessage TEXT NOT NULL,
        shape TEXT NOT NULL,
        allergies TEXT NOT NULL,
        specialIngredients TEXT NOT NULL,
        packagingType TEXT NOT NULL
    )`;
const INSERT_CAKE = `INSERT OR IGNORE INTO ${table_name} (id, 
    cakeType,
     flavor,
      filling,
       size,
        layers,
         frostingType,
          frostingFlavor,
           decorationType,
            decorationColor,
             customMessage,
              shape,
               allergies,
                specialIngredients,
                 packagingType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

const SELECT_BY_ID = `SELECT id, cakeType, flavor, filling, size, layers, frostingType, frostingFlavor, decorationType, decorationColor, customMessage, shape, allergies, specialIngredients, packagingType FROM ${table_name} WHERE id = ?`;

const SELECT_ALL = `SELECT * FROM ${table_name} `;
const DELETE_ID = `DELETE FROM ${table_name} WHERE id = ?`;
const UPDATE_ID = `UPDATE ${table_name} SET cakeType = ?, flavor = ?, filling = ?, size = ?, layers = ?, frostingType = ?, frostingFlavor = ?, decorationType = ?, decorationColor = ?, customMessage = ?, shape = ?, allergies = ?, specialIngredients = ?, packagingType = ? WHERE id = ?`;

export class CakeRepository implements IRepository<IdetifiableCake>, IInitializable {

    async init(): Promise<void> {
        try {
            const conn = await ConnectionManager.getInstance().getConnection();
            await conn.exec(CREATE_TABLE_QUERY);
            logger.info("Cake table intitalised");
        }
        catch (error: unknown) {
            logger.error("Failed to initialise cake repository", error as Error);
            throw new InitializationException("Failed to initialise cake repository", error as Error);
        }
    }

    async create(item: IdetifiableCake): Promise<id> {
        // it is expected that a transaction has been initiated before this method is called
        try {
            const conn = await ConnectionManager.getInstance().getConnection();
            await conn.run(INSERT_CAKE, [
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
            const conn = await ConnectionManager.getInstance().getConnection();
            const result = await conn.get<SQLiteCake>(SELECT_BY_ID, id);
            if (!result) {
                throw new ItemNotFoundException("Cake with id " + id + " not found");
            }
            logger.info("Cake got: %o", result);
            return new SQLiteCakeMapper().map(result); // TODO must remove and map
        } catch (error: unknown) {
            logger.error("Failed to get cake of id %s %o", id, error as Error);
            throw new DbException("Failed to get cake of id " + id, error as Error);
        }
    }
   async getAll(): Promise<IdetifiableCake[]> {
       try {
            const conn = await ConnectionManager.getInstance().getConnection();
            const result = await conn.all<SQLiteCake[]>(SELECT_ALL);
            const mapper = new SQLiteCakeMapper();
            const identifiableCakes = result.map(cake => mapper.map(cake));

            return identifiableCakes;
        } catch (error: unknown) {
            logger.error("Failed to get all cakes ",  error as Error);
            throw new DbException("Failed to get all cakes", error as Error);
        }
    }
    async update(item: IdetifiableCake): Promise<void> {
        // Implementation for updating a cake
        try {
            const conn = await ConnectionManager.getInstance().getConnection();
            const result = await conn.run(UPDATE_ID, [
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
            const conn = await ConnectionManager.getInstance().getConnection();
            const result = await conn.run(DELETE_ID, id);
        } catch (error: unknown) {
            logger.error("Failed to delete cake of id %s %o", id, error as Error);
            throw new DbException("Failed to delete cake of id " + id, error as Error);
        }
    }

}