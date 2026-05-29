import { IIdentifiableOrderItem, IOrder } from "../Model/IOrder";
import { IInitializable, IRepository } from "./IRepository";
import { ItemCategory } from "../Model/IItem";
import { CakeOrderRepository } from "./file/CakeOrder.repository";
import { OrderRepository } from "./sqlite/Order.Repository";
import { CakeRepository } from "./sqlite/Cake.order.repository";
import { BookRepository } from "./sqlite/Book.order.repository";
import { ToyRepository } from "./sqlite/Toy.order.repository";
import { PGOrderRepository } from "./postgres/Order.postgres.repository";
import { PGCakeRepository } from "./postgres/Cake.postgres.repository";
import { PGBookRepository } from "./postgres/Book.postgres.repository";
import { PGToyRepository } from "./postgres/Toy.postgres.repository";

import { DBMode } from "./DBMode";

export { DBMode } from "./DBMode";

export class RepositoryFactory {
    public static async create(mode: DBMode, category: ItemCategory): Promise<IRepository<IIdentifiableOrderItem>> {
        switch (mode) {

            case DBMode.SQLITE: {
                let repository: IRepository<IIdentifiableOrderItem> & IInitializable;
                switch (category) {
                    case ItemCategory.CAKE:
                        repository = new OrderRepository(new CakeRepository());
                        break;
                    case ItemCategory.BOOK:
                        repository = new OrderRepository(new BookRepository());
                        break;
                    case ItemCategory.TOY:
                        repository = new OrderRepository(new ToyRepository());
                        break;
                    default:
                        throw new Error(`Unsupported category ${category}`);
                }
                await repository.init();
                return repository;
            }

            case DBMode.POSTGRES: {
                let repository: IRepository<IIdentifiableOrderItem> & IInitializable;
                switch (category) {
                    case ItemCategory.CAKE:
                        repository = new PGOrderRepository(new PGCakeRepository());
                        break;
                    case ItemCategory.BOOK:
                        repository = new PGOrderRepository(new PGBookRepository());
                        break;
                    case ItemCategory.TOY:
                        repository = new PGOrderRepository(new PGToyRepository());
                        break;
                    default:
                        throw new Error(`Unsupported category ${category}`);
                }
                await repository.init();
                return repository;
            }
            // Depricated file storage, not fully implemented
            // case DBMode.FILE:
            //     switch (category) {
            //         case ItemCategory.CAKE:
            //             return new CakeOrderRepository(config.storagePath.csv.cake);
            //         case ItemCategory.BOOK:
            //             return new CakeOrderRepository(config.storagePath.json.book);
            //         case ItemCategory.TOY:
            //             return new CakeOrderRepository(config.storagePath.xml.toy);
            //         default:
            //             throw new Error(`Unsupported category ${category}`);
                // }

            default:
                throw new Error(`Unsupported DB mode ${mode}`);
        }
    }
    public static async createItemRepository(mode: DBMode, category: ItemCategory): Promise<IRepository<any> & IInitializable> {
    switch (mode) {
        case DBMode.SQLITE: {
            let repository: IRepository<any> & IInitializable;
            switch (category) {
                case ItemCategory.BOOK:
                    repository = new BookRepository();
                    break;
                case ItemCategory.TOY:
                    repository = new ToyRepository();
                    break;
                default:
                    throw new Error(`Unsupported category ${category}`);
            }
            await repository.init();
            return repository;
        }
        case DBMode.POSTGRES: {
            let repository: IRepository<any> & IInitializable;
            switch (category) {
                case ItemCategory.BOOK:
                    repository = new PGBookRepository();
                    break;
                case ItemCategory.TOY:
                    repository = new PGToyRepository();
                    break;
                default:
                    throw new Error(`Unsupported category ${category}`);
            }
            await repository.init();
            return repository;
        }
        default:
            throw new Error(`Unsupported DB mode ${mode}`);
    }
}
}
