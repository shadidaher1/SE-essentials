import { ID, IRepository, id } from '../IRepository';
import { Order } from '../../Model/Order.Model';
import logger from '../../util/logger';
import { stringify } from 'node:querystring';
import { InvalidItemException, ItemNotFoundException } from '../../util/exceptions/repositoryExcpetion';
import { IOrder } from '../../Model/IOrder';

export abstract class OrderRepository implements IRepository<IOrder & ID> {
    
    
    protected abstract load(): Promise<(IOrder & ID)[]>;
    protected abstract save(orders: (IOrder & ID)[]): Promise<void>;

    async create(item: IOrder & ID): Promise<id> {
        // validate order
        if (!item){
            logger.error('Invalid order item provided for creation.');
            throw new InvalidItemException('Oder cannot be null');
        }
        // load all orders
        const orders = await this.load();
        // add new order to list
        const id =  orders.push(item);
        // save all orders
        await this.save(orders);
        logger.info(`Order with ID ${id} created successfully.`);
        return String(id);
    }
    async get(id: id): Promise<(IOrder & ID)> {
        const orders = await this.load();
        const order = orders.find(order => order.getID() === id);
        if (!order) {
            logger.error(`Order with ID ${id} not found.`);
            throw new Error(`Order with ID ${id} not found.`);
        }
        return Promise.resolve(order);
    }
    async getAll(): Promise<(IOrder & ID)[]> {
        return this.load();
    }
    async update(item: IOrder & ID): Promise<void> {
        if (!item) {
            logger.error('Invalid order item provided for update.');
            throw new InvalidItemException('Oder cannot be null');
        }
        const orders = await this.load();
        const index = orders.findIndex(order => order.getID() === item.getID());
        if (index === -1) {
            logger.error(`Order with ID ${item.getID()} not found for update.`);
            throw new ItemNotFoundException(`Falied to find the item`);
        }

        orders[index] = item;
        await this.save(orders);
        logger.info(`Order with ID ${item.getID()} updated successfully.`);
    }
    async delete(id: id): Promise<void> {
        
        if (!id) {
            logger.error('Invalid order ID provided for deletion.');
            throw new InvalidItemException('ID cannot be null');
        }
        const orders = await this.load();
        const index = orders.findIndex(order => order.getID() === id);
        if (index === -1) {
            logger.error(`Order with ID ${id} not found for deletion.`);
            throw new ItemNotFoundException(`Falied to find the item`);
        }
        orders.splice(index, 1);
        await this.save(orders);
        logger.info(`Order with ID ${id} deleted successfully.`);
    }

    
   
}