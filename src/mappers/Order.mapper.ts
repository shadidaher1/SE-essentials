import { OrderBuilder } from "../Model/builders/order.builder";
import { IItem } from "../Model/IItem";
import { IOrder } from "../Model/IOrder";
import { Order } from "../Model/Order.Model";
import { IMapper } from "./IMapper";

export class CSVOrderMapper implements IMapper<string[], IOrder> {
    constructor(private itemMapper: IMapper<string[], IItem>) {}
    map(data: string[]): IOrder {
        const item = this.itemMapper.map(data);
        return OrderBuilder.newBuilder()
            .setItem(item)
            .setPrice(parseFloat(data[data.length - 1]))
            .setId(data[0])
            .setQuantity(parseInt(data[data.length - 2]))
            .build();

    }
}