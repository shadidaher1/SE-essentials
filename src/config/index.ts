import { config } from "dotenv"
import path from "path"
import { json } from "stream/consumers"
import { DBMode } from "../repository/Repository.factory"

config({ path: path.join(__dirname, '../../.env') })

export default {
    logDir: process.env.LOG_DIR || 'logs',
    isDev: process.env.NODE_ENV !== 'development',
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
    dbMode : DBMode.SQLITE
}