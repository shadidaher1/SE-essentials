import { IRepository } from "../repository/IRepository";
import { RepositoryFactory } from "../repository/Repository.factory";
import config from "../config";
import { IIdentifiableOrderItem } from "../Model/IOrder";
import { ItemCategory } from "../Model/IItem";

export type OrderCountByType = Record<ItemCategory, number>;
export type RevenueByType = Record<ItemCategory, number>;

export class AnalyticsService {
  public async getTotalOrderCount(): Promise<number> {
    const orders = await this.getAllOrders();
    return orders.length;
  }

  public async getOrderCountByType(): Promise<OrderCountByType> {
    const categories = this.getCategories();
    const counts: OrderCountByType = {
      [ItemCategory.CAKE]: 0,
      [ItemCategory.BOOK]: 0,
      [ItemCategory.TOY]: 0,
    };

    for (const category of categories) {
      const orders = await this.getOrdersForCategory(category);
      counts[category] = orders.length;
    }

    return counts;
  }

  public async getTotalRevenue(): Promise<number> {
    const orders = await this.getAllOrders();
    return orders.reduce((total, order) => total + order.getPrice() * order.getQuantity(), 0);
  }

  public async getRevenueByType(): Promise<RevenueByType> {
    const categories = this.getCategories();
    const revenue: RevenueByType = {
      [ItemCategory.CAKE]: 0,
      [ItemCategory.BOOK]: 0,
      [ItemCategory.TOY]: 0,
    };

    for (const category of categories) {
      const orders = await this.getOrdersForCategory(category);
      revenue[category] = orders.reduce((sum, order) => sum + order.getPrice() * order.getQuantity(), 0);
    }

    return revenue;
  }

  private async getAllOrders(): Promise<IIdentifiableOrderItem[]> {
    const categories = this.getCategories();
    const ordersByCategory = await Promise.all(
      categories.map((category) => this.getOrdersForCategory(category))
    );
    return ordersByCategory.flat();
  }

  private async getOrdersForCategory(category: ItemCategory): Promise<IIdentifiableOrderItem[]> {
    const repository = await this.getRepo(category);
    return repository.getAll();
  }

  private async getRepo(category: ItemCategory): Promise<IRepository<IIdentifiableOrderItem>> {
    return RepositoryFactory.create(config.dbMode, category);
  }

  private getCategories(): ItemCategory[] {
    return Object.values(ItemCategory) as ItemCategory[];
  }
}
