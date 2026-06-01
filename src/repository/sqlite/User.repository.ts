import { User } from "../../Model/User.Model";
import { ConnectionManager } from "../../util/database/ConnectionManager";
import { DbException, InitializationException } from "../../util/exceptions/repositoryExcpetion";
import logger from "../../util/logger";
import { IInitializable, IRepository, id } from "../IRepository";

const tableName = "users";

interface UserRow {
    id: string;
    name: string;
    email: string;
    password: string;
}

export const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS ${tableName} (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
)`;

export const INSERT = `
INSERT INTO ${tableName} (
    id, name, email, password
) VALUES (?, ?, ?, ?)`;

export const SELECT_BY_ID = `SELECT * FROM ${tableName} WHERE id = ?`;

export const SELECT_BY_EMAIL = `SELECT * FROM ${tableName} WHERE email = ?`;

export const SELECT_ALL = `SELECT * FROM ${tableName}`;

export const UPDATE = `
UPDATE ${tableName} SET
    name = ?,
    email = ?,
    password = ?
WHERE id = ?`;

export const DELETE = `DELETE FROM ${tableName} WHERE id = ?`;

export class UserRepository implements IRepository<User>, IInitializable {
    async init(): Promise<void> {
        try {
            const conn = await ConnectionManager.getInstance().getConnection();
            await conn.exec(CREATE_TABLE);
            logger.info("User table initialised");
        } catch (error: unknown) {
            logger.error("Failed to initialise user repository", error as Error);
            throw new InitializationException("Failed to initialise user repository", error as Error);
        }
    }

    async create(item: User): Promise<id> {
        try {
            const conn = await ConnectionManager.getInstance().getConnection();
            await conn.run(INSERT, [
                item.getID(),
                item.getName(),
                item.getEmail(),
                item.getPassword()
            ]);
            logger.info(`User created with ID: ${item.getID()}`);
            return item.getID();
        } catch (error: unknown) {
            logger.error("Failed to create user", error as Error);
            throw new DbException("Failed to create user", error as Error);
        }
    }

    async get(itemID: id): Promise<User> {
        try {
            const conn = await ConnectionManager.getInstance().getConnection();
            const result = await conn.get(SELECT_BY_ID, [itemID]);
            
            if (!result) {
                throw new DbException(`User with ID ${itemID} not found`, new Error("User not found"));
            }

            const userRow = result as UserRow;
            return new User(userRow.id, userRow.name, userRow.email, userRow.password);
        } catch (error: unknown) {
            logger.error(`Failed to get user with ID ${itemID}`, error as Error);
            throw new DbException(`Failed to get user with ID ${itemID}`, error as Error);
        }
    }

    async getByEmail(email: string): Promise<User> {
        try {
            const conn = await ConnectionManager.getInstance().getConnection();
            const result = await conn.get(SELECT_BY_EMAIL, [email]);
            
            if (!result) {
                throw new DbException(`User with email ${email} not found`, new Error("User not found"));
            }

            const userRow = result as UserRow;
            return new User(userRow.id, userRow.name, userRow.email, userRow.password);
        } catch (error: unknown) {
            logger.error(`Failed to get user with email ${email}`, error as Error);
            throw new DbException(`Failed to get user with email ${email}`, error as Error);
        }
    }

    async getAll(): Promise<User[]> {
        try {
            const conn = await ConnectionManager.getInstance().getConnection();
            const results = await conn.all(SELECT_ALL, []);
            
            return (results as UserRow[]).map((row: UserRow) => new User(row.id, row.name, row.email, row.password));
        } catch (error: unknown) {
            logger.error("Failed to get all users", error as Error);
            throw new DbException("Failed to get all users", error as Error);
        }
    }

    async update(item: User): Promise<void> {
        try {
            const conn = await ConnectionManager.getInstance().getConnection();
            await conn.run(UPDATE, [
                item.getName(),
                item.getEmail(),
                item.getPassword(),
                item.getID()
            ]);
            logger.info(`User ${item.getID()} updated`);
        } catch (error: unknown) {
            logger.error(`Failed to update user ${item.getID()}`, error as Error);
            throw new DbException(`Failed to update user ${item.getID()}`, error as Error);
        }
    }

    async delete(itemID: id): Promise<void> {
        try {
            const conn = await ConnectionManager.getInstance().getConnection();
            await conn.run(DELETE, [itemID]);
            logger.info(`User ${itemID} deleted`);
        } catch (error: unknown) {
            logger.error(`Failed to delete user ${itemID}`, error as Error);
            throw new DbException(`Failed to delete user ${itemID}`, error as Error);
        }
    }
}
