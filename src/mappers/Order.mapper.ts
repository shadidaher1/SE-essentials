import { IdentifiableOrderItemBuilder, OrderBuilder } from "../Model/builders/order.builder";
import { IIdentifiableItem, IItem } from "../Model/IItem";
import { IIdentifiableOrderItem, IOrder } from "../Model/IOrder";
import { Order } from "../Model/Order.Model";
import { IMapper } from "./IMapper";

export class CSVOrderMapper implements IMapper<string[], IOrder> {
    constructor(private itemMapper: IMapper<string[], IItem>) { }

    map(data: string[]): IOrder {
        const item = this.itemMapper.map(data);
        return OrderBuilder.newBuilder()
            .setItem(item)
            .setPrice(parseFloat(data[data.length - 1]))
            .setId(data[0])
            .setQuantity(parseInt(data[data.length - 2]))
            .build();

    }
    reverseMap(input: IOrder): string[] {
        const itemData = this.itemMapper.reverseMap(input.getItem());
        return [
            input.getID(),
            ...itemData,
            String(input.getQuantity()),
            String(input.getPrice())
        ]
    }
}

// export interface ISQLiteOrder {
//     id: string;
//     quantity: number;
//     price: number;
//     item_category: string;
//     item_id: string;
    
// }

// export class SQLiteOrderMapper implements IMapper<ISQLiteOrder, IIdentifiableOrderItem> {
//     constructor(private itemMapper: IMapper<string[], IItem>) { }

//     map(data: ISQLiteOrder): IOrder {
//         const item = this.itemMapper.map(data);
//         return OrderBuilder.newBuilder()    
//             .setItem(item)
//             .setPrice(parseFloat(data[data.length - 1]))
//             .setId(data[0])
//             .setQuantity(parseInt(data[data.length - 2]))
//             .build();

//     }
//     reverseMap(input: IOrder): string[] {
//         const itemData = this.itemMapper.reverseMap(input.getItem());
//         return [
//             input.getID(),
//             ...itemData,
//             String(input.getQuantity()),
//             String(input.getPrice())
//         ]
//     }
// }
export interface SQLiteOrder {
    id: string;
    quantity: number;
    price: number;
    item_category: string;
    item_id: string;
    
}

export class SQLiteOrderMapper implements IMapper<{data:SQLiteOrder, item: IIdentifiableItem}, IIdentifiableOrderItem> {

    map({data, item}: {data:SQLiteOrder, item: IIdentifiableItem}): IIdentifiableOrderItem {
        const order = OrderBuilder.newBuilder().setId(data.id)
            .setPrice(data.price)
            .setQuantity(data.quantity)
            .setItem(item)
            .build();
        return IdentifiableOrderItemBuilder.newBuilder().setOrder(order).setIdentifiableItem(item).build();
    }

    reverseMap(data: IIdentifiableOrderItem): {data:SQLiteOrder, item: IIdentifiableItem} {
        return {
            data: {
                id: data.getID(),
                price: data.getPrice(),
                quantity: data.getQuantity(),
                item_category: data.getItem().getCategory(),
                item_id: data.getItem().getID()
            },
            item: data.getItem()
        }
    }

}