import { ID } from "../repository/IRepository";
import { IIdentifiableItem, IItem } from "./IItem";

export interface IOrder {
    getItem(): IItem;
    getPrice(): number;
    getID(): string;
    getQuantity(): number;
}

export interface IIdentifiableOrderItem extends IOrder, ID {
    getItem(): IIdentifiableItem;
}
