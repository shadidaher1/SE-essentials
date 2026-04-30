import { Item } from "./Item.Model";

export interface Order {
    getItem(): Item;
    getPrice(): number;
    getId(): string;
    getQuantity(): number;
}


