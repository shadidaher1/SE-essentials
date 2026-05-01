import { IItem } from "../IItem";
import { IOrder } from "../IOrder";
import { Order } from "../Order.Model";

export class OrderBuilder {
    private item!: IItem;
    private price!: number;
    private id!: string;
    private quantity!: number;

    setItem(item: IItem): this {
        this.item = item;
        return this;
    }

    setPrice(price: number): this {
        this.price = price;
        return this;
    }

    setId(id: string): this {
        this.id = id;
        return this;
    }

    setQuantity(quantity: number): this {
        this.quantity = quantity;
        return this;
    }
    public static newBuilder(): OrderBuilder {
        return new OrderBuilder();
    }

    build(): IOrder {
        if (!this.item || !this.price || !this.id || !this.quantity) {
            throw new Error("Missing required fields to build Order");
        }
        return new Order(this.item, this.price, this.id, this.quantity);
    }
}