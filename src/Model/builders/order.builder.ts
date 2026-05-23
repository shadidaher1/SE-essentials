import { IIdentifiableItem, IItem } from "../IItem";
import { IIdentifiableOrderItem, IOrder } from "../IOrder";
import { IdetifiableOrderItem, Order } from "../Order.Model";

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

    build(): Order {
        if (!this.item || !this.price || !this.id || !this.quantity) {
            throw new Error("Missing required fields to build Order");
        }
        return new Order(this.item, this.price, this.id, this.quantity);
    }
}

export class IdentifiableOrderItemBuilder {
    private identifiableItem!: IIdentifiableItem;
    private order!: Order;
    

    setIdentifiableItem(identifiableItem: IIdentifiableItem): this {
        this.identifiableItem = identifiableItem;
        return this;
    }
   
    setOrder(order: Order): this {
        this.order = order;
        return this;
    }
    build(): IIdentifiableOrderItem {
        if (!this.identifiableItem || !this.order) {
            throw new Error("Missing required fields to build IdetifiableOrderItem");
        }
        return new IdetifiableOrderItem(this.identifiableItem, this.order.getPrice(), this.order.getID(), this.order.getQuantity());
    }
    public static newBuilder(): IdentifiableOrderItemBuilder {
        return new IdentifiableOrderItemBuilder();
    }
}