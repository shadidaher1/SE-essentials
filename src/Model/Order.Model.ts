import { IItem } from "./IItem";
import { IOrder } from "./IOrder";

export class Order implements IOrder {
    private item: IItem;
    private price: number;
    private id: string;
    private quantity: number;

    constructor(item: IItem, price: number, id: string, quantity: number) {
        this.item = item;
        this.price = price;
        this.id = id;
        this.quantity = quantity;
    }

    getItem(): IItem {
        return this.item;
    }
    getPrice(): number {
        return this.price;
    }
    getId(): string {
        return this.id;
    }
    getQuantity(): number {
        return this.quantity;
    }
}