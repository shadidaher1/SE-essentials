import { Pool } from "pg";

export class PGConnectionManager {
    private static instance: PGConnectionManager;
    private pool: Pool | null = null;

    private constructor() {}

    public static getInstance(): PGConnectionManager {
        if (!PGConnectionManager.instance) {
            PGConnectionManager.instance = new PGConnectionManager();
        }
        return PGConnectionManager.instance;
    }

    public async getConnection(): Promise<Pool> {
        if (!this.pool) {
            this.pool = new Pool({
                connectionString: process.env.PG_CONNECTION_STRING,
                ssl: { rejectUnauthorized: false }
            });
        }
        return this.pool;
    }

    public async closeConnection(): Promise<void> {
        if (this.pool) {
            await this.pool.end();
            this.pool = null;
        }
    }
}