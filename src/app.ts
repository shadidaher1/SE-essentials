// SOLID Principles

// Single Responsibility Principle (SRB)
// Open Closed Principle (OCP)
// Liskov Substitution Principle (LSP)
// Interface Segregation Principle
// Depandance Inversion Principle (DIP)

export interface Order{
  price: number;
  item: string;
  id: number;
}

export class OrderManagment{
  // ger orders, store orders, add orders
  private orders: Order[] = [];
  constructor(private validator: IValidator, private calculator: ICalculator){

  }
  getOrders(){
      return this.orders;
  }
  addOrder(item: string, price: number){
      const order: Order ={id: this.orders.length +1,item, price };
      this.validator.validate(order);
      this.orders.push(order);
  }
  getOrderbyId(id: number){
      return this.getOrders().find(order => order.id === id);
  }
  getTotalRevnue()
  {
      return this.calculator.getRevenue(this.orders);
  }
  getTotalPower(){
      return this.calculator.getPower(this.orders);
  }

}
interface IValidator{
  validate(order: Order): void;
}
interface Ipossibleitems{
  getPossibleItems(): string[]; 
}

export class Validator implements IValidator{
 constructor(private rules: IValidator[]){

 }
  // Validate orders
  // validate price positive
  // valide item is available
  validate(order: Order): void {
      this.rules.forEach(rule => rule.validate(order))
  }

    }
export  class ItemValidator implements IValidator, Ipossibleitems{
      getPossibleItems(): string[] {
          return ItemValidator.possibleItems;
      }
      private static possibleItems = [
          "Sponge",
          "Chocolate",
          "Fruit",
          "Red Velvet",
          "Birthday",
          "Carrot",
          "Marble",
          "Coffee",
        ];
      validate(order: Order){
          if (!ItemValidator.possibleItems.includes(order.item)){
              throw new Error(`Invalid item. Must be one of: ${ItemValidator.possibleItems.join(", ")}`);
            }
      }
    } 


export  class PriceValidator implements IValidator{
      validate(order: Order){
          if(order.price <= 0){
              throw new Error("Price must be greater than zero");
          }
    }
    
    
  }
export  class validateMaxPrice implements IValidator{
      validate(order: Order){
          if(order.price > 100){
              throw new Error("Price must be lass than 100"); 
          }
      }
    }

export class PremiumOrderMangment extends OrderManagment{

  getOrderbyId(id: number): Order| undefined{
      console.log("ALERT PREMIUM BEING FTECHED");
      return super.getOrderbyId(id);
  }
}
interface ICalculator{
  getRevenue(order: Order[]):number;
  getPower(order: Order[]): number;
}
export class FinanceCalculator implements ICalculator{
  // calculate finance
  public  getRevenue(order: Order[]){
      return order.reduce((total, order)=> total + order.price, 0 )

  }
  public  getPower(order: Order[]){
      return order.length === 0 ? 0: this.getRevenue(order) / order.length
  }
}