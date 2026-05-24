import { IO } from "node:inspector/promises";
import { IOrder } from "../Model/IOrder";
import { IInitializable, IRepository } from "./IRepository";
import { ItemCategory } from "../Model/IItem";
import { CakeOrderRepository } from "./file/CakeOrder.repository";
import config from "../config";
import { OrderRepository } from "./sqlite/Order.Repository";
import { CakeRepository } from "./sqlite/Cake.order.repository";
import { BookRepository } from "./sqlite/Book.order.repository";
import { ToyRepository } from "./sqlite/Toy.order.repository";
// import { config } from "dotenv";
import { PGCakeRepository } from "./postgres/Cake.postgres.repository";
import { PGBookRepository } from "./postgres/Book.postgres.repository";
import { PGToyRepository } from "./postgres/Toy.postgres.repository";
import { PGOrderRepository } from "./postgres/Order.postgres.repository";


export enum DBMode {
    SQLITE = "sqlite",
    FILE = "file",
    POSTGRES = "postgres"
}



export class RepositoryFactory {

    public static async create(mode : DBMode, category: ItemCategory): Promise<IRepository<IOrder>> {
        switch (mode) {
            case DBMode.SQLITE: {
                let repository: IRepository<IOrder> & IInitializable;
                switch (category) {
                    case ItemCategory.CAKE:
                        repository = new OrderRepository(new CakeRepository());
                        break;
                        default:
                            throw new Error("Unsupported category");
                    }
                await repository.init();
                return repository;
            }
            case DBMode.FILE:
                switch (category) {
                    case ItemCategory.CAKE:
                        return new CakeOrderRepository(config.storagePath.csv.cake);
                    default:
                        throw new Error("Unsupported category");
                }
            default:
                throw new Error("Unsupported DB mode");
        } 

    }
}