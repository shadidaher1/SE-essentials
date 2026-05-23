import { Database } from "sqlite3";
import { open, Database as SQLiteDatabase } from "sqlite";
import config from "../../config";

export class ConnectionManager {
    private static instance: ConnectionManager;
    private db: SQLiteDatabase | null = null;

    private constructor() {}

    public static getInstance(): ConnectionManager {
        if (!ConnectionManager.instance) {
            ConnectionManager.instance = new ConnectionManager();
        }
        return ConnectionManager.instance;
    }

    public async getConnection(): Promise<SQLiteDatabase> {
        if (!this.db) {
            this.db = await open({
                filename: config.storagePath.sqlite,
                driver: Database
            });
        }
        return this.db;
    }

    public async closeConnection(): Promise<void> {
        if (this.db) {
            await this.db.close();
            this.db = null;
        }
    }
}
