import { config } from "dotenv"
import path from "path"
import { DBMode } from "../repository/DBMode"
import type { StringValue } from "ms";


config({ path: path.join(__dirname, '../../.env') })

export default {
    logDir: process.env.LOG_DIR || 'logs',
    isDev: process.env.NODE_ENV !== 'development',
    isProduction: process.env.NODE_ENV === 'production',
    storagePath: {
        csv: {
            cake: "src/data/cake orders.csv",
        },
        sqlite: "src/data/orders.db",
        json:{
            book: "src/data/book orders.json"
        },
        xml: {
            toy: "src/data/toy orders.xml"
        },
     
 
    },
    port: process.env.PORT ? parseInt(process.env.PORT ) : 3000,
    host: process.env.HOST || '127.0.0.1',
    dbMode : DBMode.SQLITE,
    auth: {
        secretKey: process.env.AUTH_SECRET_KEY || 'default_secret_key',
        tokenExpiration: (process.env.AUTH_TOKEN_EXPIRATION || '15m') as StringValue,
        refreshTokenExpiration: (process.env.AUTH_REFRESH_TOKEN_EXPIRATION || '7d') as StringValue,
    }
}