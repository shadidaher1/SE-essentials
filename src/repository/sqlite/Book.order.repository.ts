import { SQLiteBook, SQLiteBookMapper } from "../../mappers/Book.mapper";
import { IdetifiableBook } from "../../Model/Book.Model";
import { ItemCategory } from "../../Model/IItem";
import { ConnectionManager } from "../../util/database/ConnectionManager";
import { DbException,  InitializationException } from "../../util/exceptions/repositoryExcpetion";
import logger from "../../util/logger";
import { IInitializable, IRepository } from "../IRepository";


const tableName = ItemCategory.BOOK;

export const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS ${tableName} (
    id TEXT PRIMARY KEY,
    bookTitle TEXT NOT NULL,
    author TEXT NOT NULL,
    genre TEXT NOT NULL,
    format TEXT NOT NULL,
    language TEXT NOT NULL,
    publisher TEXT NOT NULL,
    specialEdition TEXT NOT NULL,
    packaging TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL
)`;

export const INSERT = `
INSERT OR IGNORE INTO ${tableName} (
    id, bookTitle, author, genre, format, language, 
    publisher, specialEdition, packaging, price, quantity
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

export const SELECT_BY_ID = `SELECT * FROM ${tableName} WHERE id = ?`;

export const UPDATE = `
UPDATE ${tableName} SET
    bookTitle = ?,
    author = ?,
    genre = ?,
    format = ?,
    language = ?,
    publisher = ?,
    specialEdition = ?,
    packaging = ?,
    price = ?,
    quantity = ?
WHERE id = ?`;

export const DELETE = `DELETE FROM ${tableName} WHERE id = ?`;


export class BookRepository implements IRepository<IdetifiableBook>, IInitializable {
    async init(): Promise<void> {
        try {
            const conn = await ConnectionManager.getInstance().getConnection();
            await conn.exec(CREATE_TABLE);
            logger.info("Book table initialised");
        } catch (error: unknown) {
            logger.error("Failed to initialise book repository", error as Error);
            throw new InitializationException("Failed to initialise book repository", error as Error);
        }
        }
    async create(item: IdetifiableBook): Promise<string> {
        try {
            const conn = await ConnectionManager.getInstance().getConnection();
            await conn.run(INSERT, [
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
            const conn = await ConnectionManager.getInstance().getConnection();
            const row = await conn.get<SQLiteBook>(SELECT_BY_ID, [id]);
            if (!row) {
                throw new Error(`Book with id ${id} not found`);
            }
            logger.info(`Book with id ${id} retrieved`);
            return new SQLiteBookMapper().map(row);
        } catch (error: unknown) {
            logger.error(`Failed to retrieve book with id ${id}`, error as Error);
            throw new DbException("Failed to retrieve book", error as Error);
        }
    }
    async getAll(): Promise<IdetifiableBook[]> {
        try {
            const conn = await ConnectionManager.getInstance().getConnection();
            const rows = await conn.all<SQLiteBook[]>(`SELECT * FROM ${tableName}`);
            return rows.map(row => new SQLiteBookMapper().map(row));
        } catch (error: unknown) {
            logger.error("Failed to retrieve all books", error as Error);
            throw new DbException("Failed to retrieve all books", error as Error);
        }
    }
    async update(item: IdetifiableBook): Promise<void> {
        try{
            const conn = await ConnectionManager.getInstance().getConnection();
            await conn.run(UPDATE, [
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
        }
        catch (error: unknown) {
            logger.error(`Failed to update book with id ${item.getID()}`, error as Error);
            throw new DbException("Failed to update book", error as Error);
        }
    }
    async delete(id: string): Promise<void> {
        try {
            const conn = await ConnectionManager.getInstance().getConnection();
            await conn.run(DELETE, [id]);
        } catch (error: unknown) {
            logger.error(`Failed to delete book with id ${id}`, error as Error);
            throw new DbException("Failed to delete book", error as Error);
        }
    }
}