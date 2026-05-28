import { Order } from "../Model/Order.Model";
import { RepositoryFactory } from "../repository/Repository.factory";
import { generateUUID } from "../util";
import { ServiceException } from "../util/exceptions/ServiceException";
import {v4 as uuidv4} from 'uuid';
import config from "../config";
import { IIdentifiableItem, ItemCategory } from "../Model/IItem";
import { IIdentifiableOrderItem } from "../Model/IOrder";
import { IRepository } from "../repository/IRepository";


export class orderManagementService {
    constructor() {
        // Initialize any necessary properties or dependencies here
    }

    
    // Create a new order
    public async createOrder(order: IIdentifiableOrderItem): Promise<IIdentifiableOrderItem> {
        // validate the order
       this.validateOrder(order);
       
        

        // persist the new order
        const repo = await this.getRepo( order.getItem().getCategory());
        repo.create(order);
        return order;
    }
    // Get Order
    public async getOrder(id: string): Promise<IIdentifiableOrderItem> {
        const categories = Object.values(ItemCategory);
        for (const category of categories) {
            const repo = await this.getRepo(category);
            const order = await repo.get(id);
            if (order) {
                return order;
            }
        }
    throw new ServiceException(`Order with id ${id} not found`);
}
    // Update Order
    public async updateOrder(order: IIdentifiableOrderItem): Promise<void> {
        this.validateOrder(order);
        const repo = await this.getRepo(order.getItem().getCategory());
        await repo.update(order);
}
    // Delete Order
    public async deleteOrder(id: string): Promise<void> {
    const categories = Object.values(ItemCategory);
    for (const category of categories) {
        const repo = await this.getRepo(category);
        const order = await repo.get(id);
        if (order) {
            await repo.delete(id);
            return;
        }
    }
    throw new ServiceException(`Order with id ${id} not found`);
}
    // Get All Orders
    public async getAllOrders(): Promise<IIdentifiableOrderItem[]> {
        const categories = Object.values(ItemCategory);
        let allOrders: IIdentifiableOrderItem[] = [];
        for (const category of categories) {
            const repo = await this.getRepo(category);
            const orders = await repo.getAll();
            allOrders = allOrders.concat(orders);
        }
        return allOrders;
    }

    // get total revenue
    public async getTotalRevenue(): Promise<number> {
        const orders = await this.getAllOrders();
        const revenues = orders.map(order => order.getPrice() * order.getQuantity());
        let total = 0;
        for (const revenue of revenues) {
            total += revenue;
        }
        return total;
}
    // get total orders
    public async getTotalOrders(): Promise<number> {
    const orders = await this.getAllOrders();
    return orders.length;
}

    private async getRepo(category: ItemCategory): Promise<IRepository<IIdentifiableOrderItem>> {
    return RepositoryFactory.create(config.dbMode, category);
}
private validateOrder(order: IIdentifiableOrderItem): void {
    if (!order.getItem() || order.getPrice() <= 0 || order.getQuantity() <= 0) {
        throw new ServiceException("Invalid order: item, price, and quantity must be valid.");
    }
}

}