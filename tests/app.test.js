"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../src/app");
describe('order managment', () => {
    // before all new validator and calculator
    // before each new order managment
    let validator;
    let calculator;
    let orderManagment;
    let baseValidator;
    beforeAll(() => {
        validator = new app_1.Validator();
        calculator = new app_1.FinanceCalculator();
    });
    beforeEach(() => {
        baseValidator = validator.validate;
        validator.validate = jest.fn();
        orderManagment = new app_1.OrderManagment(validator, calculator);
    });
    afterEach(() => {
        validator.validate = baseValidator;
    });
    it('should an order', () => {
        orderManagment.addOrder("Sponge", 15);
        expect(orderManagment.getOrders()).toEqual([{ id: 1, item: "Sponge", price: 15 }]);
    });
    it('should get total revenue', () => {
        const orders = [
            { id: 1, item: "Sponge", price: 15 },
            { id: 2, item: "Chocolate", price: 20 },
            { id: 3, item: "Fruit", price: 18 },
            { id: 4, item: "Red Velvet", price: 25 },
            { id: 5, item: "Coffee", price: 8 },
        ];
        const revenue = calculator.getRevenue(orders);
        expect(revenue).toBe(86);
    });
    it('should call finance calculator to get total revenue', () => {
        const item = "Sponge";
        const price = 15;
        orderManagment.addOrder(item, price);
        const spy = jest.spyOn(calculator, 'getRevenue');
        orderManagment.getTotalRevnue();
        expect(spy).toHaveReturnedWith(15);
    });
    it('should throw addition exception for invalid order', () => {
        const item = "Spongee";
        const price = 15;
        validator.validate.mockImplementation(() => {
            throw new Error("Invalid order");
        });
        expect(() => orderManagment.addOrder(item, price)).toThrow("Error adding order");
    });
});
//# sourceMappingURL=app.test.js.map