import { IIdentifiableItem, IItem } from "./IItem";
import { IIdentifiableOrderItem, IOrder } from "./IOrder";
import { ID } from "../repository/IRepository";

export class Order implements IOrder, ID {
    private item: IItem;
    private orderPrice: number;
    private id: string;
    private orderQuantity: number;

    constructor(item: IItem, price: number, id: string, quantity: number) {
        this.item = item;
        this.orderPrice = price;
        this.id = id;
        this.orderQuantity = quantity;
    }

    getItem(): IItem {
        return this.item;
    }
    getPrice(): number {
        return this.orderPrice;
    }
    getId(): string {
        return this.id;
    }
    
    getID(): string {
        return this.id;
    }
    
    getQuantity(): number {
        return this.orderQuantity;
    }
}

export class IdetifiableOrderItem implements IIdentifiableOrderItem {
   
    constructor(private identifiableItem: IIdentifiableItem, private price: number, private id: string, private quantity: number) {
    
       
    }
    getPrice(): number {
       return this.price;
    }
    getID(): string {
        return this.id;
    }
    getQuantity(): number {
        return this.quantity;
    }
    getItem(): IIdentifiableItem {
        return this.identifiableItem;
    }
}