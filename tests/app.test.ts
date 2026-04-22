import {OrderManagment, FinanceCalculator, Validator, Order} from "../src/app"


describe('order managment', () => {
    // before all new validator and calculator
    // before each new order managment
    let validator: Validator;
    let calculator: FinanceCalculator;
    let orderManagment: OrderManagment;
    let baseValidator:(order: Order) => void;

    beforeAll(() => {
        validator = new Validator();
        calculator = new FinanceCalculator();
    });

    beforeEach(() => {
        baseValidator =  validator.validate;
        validator.validate =  jest.fn();
        orderManagment = new OrderManagment(validator, calculator);
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
    })
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
        (validator.validate as jest.Mock).mockImplementation(() => {
            throw new Error("Invalid order");
        });
        expect(() => orderManagment.addOrder(item, price)).toThrow("Error adding order");
    });

});