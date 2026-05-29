import { AnalyticsService } from '../../services/Analytics.service';
import { ItemCategory } from '../../Model/IItem';
import { RepositoryFactory } from '../../repository/Repository.factory';
import { IIdentifiableOrderItem } from '../../Model/IOrder';

type MockRepository = {
  create: jest.Mock;
  get: jest.Mock;
  getAll: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
};

const createMockRepository = (orders: IIdentifiableOrderItem[]): MockRepository => ({
  create: jest.fn().mockResolvedValue(undefined),
  get: jest.fn().mockResolvedValue(undefined),
  getAll: jest.fn().mockResolvedValue(orders),
  update: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
});

const createOrder = (
  id: string,
  category: ItemCategory,
  price: number,
  quantity: number
): IIdentifiableOrderItem => ({
  getID: () => id,
  getItem: () => ({
    getCategory: () => category,
    getID: () => `${category}-item-${id}`,
  }),
  getPrice: () => price,
  getQuantity: () => quantity,
});

describe('AnalyticsService', () => {
  let mockedCreate: jest.Mock;

  beforeEach(() => {
    mockedCreate = jest.spyOn(RepositoryFactory, 'create') as jest.Mock;
    mockedCreate.mockReset();
  });

  afterEach(() => {
    mockedCreate.mockRestore();
  });

  it('returns zero values when there are no stored orders', async () => {
    const cakeRepo = createMockRepository([]);
    const bookRepo = createMockRepository([]);
    const toyRepo = createMockRepository([]);

    mockedCreate.mockImplementation(async (_mode, category) => {
      switch (category) {
        case ItemCategory.CAKE:
          return cakeRepo;
        case ItemCategory.BOOK:
          return bookRepo;
        case ItemCategory.TOY:
          return toyRepo;
        default:
          throw new Error('Unsupported category');
      }
    });

    const service = new AnalyticsService();

    await expect(service.getTotalOrderCount()).resolves.toBe(0);
    await expect(service.getOrderCountByType()).resolves.toEqual({
      [ItemCategory.CAKE]: 0,
      [ItemCategory.BOOK]: 0,
      [ItemCategory.TOY]: 0,
    });
    await expect(service.getTotalRevenue()).resolves.toBe(0);
    await expect(service.getRevenueByType()).resolves.toEqual({
      [ItemCategory.CAKE]: 0,
      [ItemCategory.BOOK]: 0,
      [ItemCategory.TOY]: 0,
    });
  });

  it('calculates total order count and grouped counts across categories', async () => {
    const cakeOrders = [createOrder('cake-1', ItemCategory.CAKE, 10, 2), createOrder('cake-2', ItemCategory.CAKE, 25, 1)];
    const bookOrders = [createOrder('book-1', ItemCategory.BOOK, 5, 3)];
    const toyOrders = [createOrder('toy-1', ItemCategory.TOY, 7.5, 4), createOrder('toy-2', ItemCategory.TOY, 12, 2)];

    mockedCreate.mockImplementation(async (_mode, category) => {
      switch (category) {
        case ItemCategory.CAKE:
          return createMockRepository(cakeOrders);
        case ItemCategory.BOOK:
          return createMockRepository(bookOrders);
        case ItemCategory.TOY:
          return createMockRepository(toyOrders);
        default:
          throw new Error('Unsupported category');
      }
    });

    const service = new AnalyticsService();

    await expect(service.getTotalOrderCount()).resolves.toBe(5);
    await expect(service.getOrderCountByType()).resolves.toEqual({
      [ItemCategory.CAKE]: 2,
      [ItemCategory.BOOK]: 1,
      [ItemCategory.TOY]: 2,
    });
  });

  it('calculates total revenue and revenue breakdown by item type', async () => {
    const cakeOrders = [createOrder('cake-1', ItemCategory.CAKE, 10, 2), createOrder('cake-2', ItemCategory.CAKE, 25, 1)];
    const bookOrders = [createOrder('book-1', ItemCategory.BOOK, 5, 3)];
    const toyOrders = [createOrder('toy-1', ItemCategory.TOY, 7.5, 4), createOrder('toy-2', ItemCategory.TOY, 12, 2)];

    mockedCreate.mockImplementation(async (_mode, category) => {
      switch (category) {
        case ItemCategory.CAKE:
          return createMockRepository(cakeOrders);
        case ItemCategory.BOOK:
          return createMockRepository(bookOrders);
        case ItemCategory.TOY:
          return createMockRepository(toyOrders);
        default:
          throw new Error('Unsupported category');
      }
    });

    const service = new AnalyticsService();

    await expect(service.getTotalRevenue()).resolves.toBeCloseTo(10 * 2 + 25 * 1 + 5 * 3 + 7.5 * 4 + 12 * 2);
    await expect(service.getRevenueByType()).resolves.toEqual({
      [ItemCategory.CAKE]: 45,
      [ItemCategory.BOOK]: 15,
      [ItemCategory.TOY]: 54,
    });
  });
});
