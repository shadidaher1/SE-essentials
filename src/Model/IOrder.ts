import { IItem } from "./IItem";

export interface IOrder {
    getItem(): IItem;
    getPrice(): number;
    getId(): string;
    getQuantity(): number;
}


