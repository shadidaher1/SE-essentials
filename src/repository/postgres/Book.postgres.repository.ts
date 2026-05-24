import { SQLiteBook, SQLiteBookMapper } from "../../mappers/Book.mapper";
import { IdetifiableBook } from "../../Model/Book.Model";
import { ItemCategory } from "../../Model/IItem";
import { PGConnectionManager } from "../../util/database/PGConnectionManager";
import { DbException, InitializationException } from "../../util/exceptions/repositoryExcpetion";
import logger from "../../util/logger";
import { IInitializable, IRepository } from "../IRepository";

const tableName = ItemCategory.BOOK;

const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS ${tableName} (
    "id" TEXT PRIMARY KEY,
    "bookTitle" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "specialEdition" TEXT NOT NULL,
    "packaging" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "quantity" INTEGER NOT NULL
)`;

const INSERT = `
INSERT INTO ${tableName} (
    "id", "bookTitle", "author", "genre", "format", "language", 
    "publisher", "specialEdition", "packaging", "price", "quantity"
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
ON CONFLICT ("id") DO NOTHING`;

const SELECT_BY_ID = `SELECT * FROM ${tableName} WHERE "id" = $1`;

const UPDATE = `
UPDATE ${tableName} SET
    "bookTitle" = $1,
    "author" = $2,
    "genre" = $3,
    "format" = $4,
    "language" = $5,
    "publisher" = $6,
    "specialEdition" = $7,
    "packaging" = $8,
    "price" = $9,
    "quantity" = $10
WHERE "id" = $11`;

const DELETE = `DELETE FROM ${tableName} WHERE "id" = $1`;

export class PGBookRepository implements IRepository<IdetifiableBook>, IInitializable {

    async init(): Promise<void> {
        try {
            const pool = await PGConnectionManager.getInstance().getConnection();
            await pool.query(CREATE_TABLE);
            logger.info("Book table initialised (PostgreSQL)");
        } catch (error: unknown) {
            logger.error("Failed to initialise book repository", error as Error);
            throw new InitializationException("Failed to initialise book repository", error as Error);
        }
    }

    async create(item: IdetifiableBook): Promise<string> {
        try {
            const pool = await PGConnectionManager.getInstance().getConnection();
            await pool.query(INSERT, [
                item.getID(),
                item.getBookTitle(),
                item.getAuthor(),
                item.getGenre(),
                item.getFormat(),
                item.getLanguage(),
                item.getPublisher(),
                item.getSpecialEdition(),
                item.getPackaging(),
                item.getPrice(),
                item.getQuantity()
            ]);
            return item.getID();
        } catch (error: unknown) {
            logger.error("Failed to create book", error as Error);
            throw new DbException("Failed to create book", error as Error);
        }
    }

    async get(id: string): Promise<IdetifiableBook> {
        try {
            const pool = await PGConnectionManager.getInstance().getConnection();
            const result = await pool.query<SQLiteBook>(SELECT_BY_ID, [id]);
            if (result.rows.length === 0) {
                throw new Error(`Book with id ${id} not found`);
            }
            logger.info(`Book with id ${id} retrieved`);
            return new SQLiteBookMapper().map(result.rows[0]);
        } catch (error: unknown) {
            logger.error(`Failed to retrieve book with id ${id}`, error as Error);
            throw new DbException("Failed to retrieve book", error as Error);
        }
    }

    async getAll(): Promise<IdetifiableBook[]> {
        try {
            const pool = await PGConnectionManager.getInstance().getConnection();
            const result = await pool.query<SQLiteBook>(`SELECT * FROM ${tableName}`);
            return result.rows.map(row => new SQLiteBookMapper().map(row));
        } catch (error: unknown) {
            logger.error("Failed to retrieve all books", error as Error);
            throw new DbException("Failed to retrieve all books", error as Error);
        }
    }

    async update(item: IdetifiableBook): Promise<void> {
        try {
            const pool = await PGConnectionManager.getInstance().getConnection();
            await pool.query(UPDATE, [
                item.getBookTitle(),
                item.getAuthor(),
                item.getGenre(),
                item.getFormat(),
                item.getLanguage(),
                item.getPublisher(),
                item.getSpecialEdition(),
                item.getPackaging(),
                item.getPrice(),
                item.getQuantity(),
                item.getID()
            ]);
        } catch (error: unknown) {
            logger.error(`Failed to update book with id ${item.getID()}`, error as Error);
            throw new DbException("Failed to update book", error as Error);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const pool = await PGConnectionManager.getInstance().getConnection();
            await pool.query(DELETE, [id]);
        } catch (error: unknown) {
            logger.error(`Failed to delete book with id ${id}`, error as Error);
            throw new DbException("Failed to delete book", error as Error);
        }
    }
}