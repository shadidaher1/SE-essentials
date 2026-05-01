import { IItem, ItemCategory } from "./IItem";

export type ToyType = "Plush Toy" | "Building Blocks" | "Action Figure" | "Doll" | "Puzzle" | "Art Kit" | "Remote Car" | "Educational Toy" | "Board Game";
export type AgeGroup = "0-3" | "4-7" | "8-12" | "13+";
export type Brand = "FunTime" | "BuildSmart" | "Adventure Co." | "ToyLand" | "KidzJoy" | "Creative Minds" | "PlayMasters";
export type Material = "Fabric" | "Plastic" | "Foam" | "Wood" | "Metal";
export type BatteryRequired = "Yes" | "No";
export type Educational = "Yes" | "No";

class Toy implements IItem {
    private orderId: string;
    private toyType: ToyType;
    private ageGroup: AgeGroup;
    private brand: Brand;
    private material: Material;
    private batteryRequired: BatteryRequired;
    private educational: Educational;
    private price: number;
    private quantity: number;

    constructor(
        orderId: string,
        toyType: ToyType,
        ageGroup: AgeGroup,
        brand: Brand,
        material: Material,
        batteryRequired: BatteryRequired,
        educational: Educational,
        price: number,
        quantity: number
    ) {
        this.orderId = orderId;
        this.toyType = toyType;
        this.ageGroup = ageGroup;
        this.brand = brand;
        this.material = material;
        this.batteryRequired = batteryRequired;
        this.educational = educational;
        this.price = price;
        this.quantity = quantity;
    }

    getCategory(): ItemCategory {
        return ItemCategory.TOY;
    }

    getOrderId(): string {
        return this.orderId;
    }

    getToyType(): ToyType {
        return this.toyType;
    }

    getAgeGroup(): AgeGroup {
        return this.ageGroup;
    }

    getBrand(): Brand {
        return this.brand;
    }

    getMaterial(): Material {
        return this.material;
    }

    getBatteryRequired(): BatteryRequired {
        return this.batteryRequired;
    }

    getEducational(): Educational {
        return this.educational;
    }

    getPrice(): number {
        return this.price;
    }

    getQuantity(): number {
        return this.quantity;
    }
}

export default Toy;
