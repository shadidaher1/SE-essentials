import { FinanceCalculator, OrderManagment, Validator, ItemValidator, PriceValidator, validateMaxPrice } from "app";


  
  const orders = [
    { id: 1, item: "Sponge", price: 15 },
    { id: 2, item: "Chocolate", price: 20 },
    { id: 3, item: "Fruit", price: 18 },
    { id: 4, item: "Red Velvet", price: 25 },
    { id: 5, item: "Coffee", price: 8 },
  ];

  const rules= [
    new ItemValidator(),
    new PriceValidator(),
    new validateMaxPrice()
   ];

const orderManagment = new OrderManagment(new Validator([]), new FinanceCalculator());
for (const order of orders){
  orderManagment.addOrder(order.item, order.price);
}

let orderId = 6; // Start new orders from ID 6

// Adding a new order directly
const newItem = "Marble";
const newPrice = 22;
orderManagment.addOrder(newItem, newPrice);
  
  
  console.log("Orders after adding a new order:", orders);
  
  // Calculate Total Revenue directly
  
  console.log("Total Revenue:", orderManagment.getTotalRevnue());
  
  // Calculate Average Buy Power directly
  console.log("Average Buy Power:", orderManagment.getTotalPower());
  
  // Fetching an order directly
  const fetchId = 2;
  codfgdfgdfgsdfgsdfgnst fetchedOrder = orderManagment.getOrderbyId(fetchId);
  console.log("Order with ID 2:", fetchedOrder);
  
  // Attempt to fetch a non-existent order
  const nonExistentId = 10;
  const nonExistentOrder = orderManagment.getOrderbyId(nonExistentId);
  console.log("Order with ID 10 (non-existent):", nonExistentOrder);