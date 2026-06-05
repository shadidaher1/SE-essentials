import { Request, Response } from "express";
import { orderManagementService } from "../services/OrderManagment.service";
import { IIdentifiableOrderItem } from "../Model/IOrder";
import { JsonRequestFactory } from "../mappers";
import { BadRequestException } from "../util/exceptions/http/BadRequestException";

export class OrderController {
    constructor(private readonly orderService: orderManagementService) {}
    // create order
    public async createOrder(req: Request, res: Response): Promise<void> {

            const orderData: IIdentifiableOrderItem = JsonRequestFactory.create(req.body.category).map(req.body);
            // Validate orderData here (e.g., check required fields, data types, etc.)
           if (!orderData){
                throw new BadRequestException('Invalid order data');
           }
            // Create order in database
            const newOrder = await this.orderService.createOrder(orderData);
            
            res.status(201).json(newOrder);
        
    }
    // get order 
    public async getOrder(req: Request, res: Response): Promise<void> {
            const rawOrderId = req.params.id;
            const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;
            if (!orderId) {
                throw new BadRequestException('Order ID is required',{
                    idNotDefined: true
                });
            }
            // Fetch order from database using orderId
            const order = await this.orderService.getOrder(orderId);
            
            res.status(200).json(order);
        
    }
    // get all orders
    public async getAllOrders(req: Request, res: Response): Promise<void> {
        
            const orders = await this.orderService.getAllOrders();
            res.status(200).json(orders);
     
    }
    // update order
    public async updateOrder(req: Request, res: Response): Promise<void> {
            const rawOrderId = req.params.id;
            const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;
            if (!orderId) {
                throw new BadRequestException('Order ID is required',{
                    idNotDefined: true
                });
            }
            const orderData: IIdentifiableOrderItem = JsonRequestFactory.create(req.body.category).map(req.body);
            // Validate orderData here (e.g., check required fields, data types, etc.)
           if (!orderData){
                throw new BadRequestException('Invalid order data',{
                    orderDataNotValid: true
                });
           }
            if (orderData.getID() !== orderId) {
                throw new BadRequestException('ID in body is different from the id in the param',{
                    idMismatch: true,
                    idInParam: orderId,
                    idInBody: orderData.getID()
                });
            }
            await this.orderService.updateOrder(orderData);
            res.status(200).json({ message: "Order updated successfully" });
        
    }
    // delete order
    public async deleteOrder(req: Request, res: Response): Promise<void> {
            const rawOrderId = req.params.id;
            const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;
            if (!orderId) {
                throw new BadRequestException('Order ID is required',{
                    idNotDefined: true
                });
            }
            await this.orderService.deleteOrder(orderId);
            res.status(200).json({ message: "Order deleted successfully" });
        
    }
    // get total revenue
}
