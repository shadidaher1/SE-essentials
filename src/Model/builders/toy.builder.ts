import logger from "../../util/logger";
import {
    ToyType,
    AgeGroup,
    Brand,
    Material,
    BatteryRequired,
    Educational
} from "../Toy.Model";
import Toy from "../Toy.Model";

export class ToyBuilder {
    private orderId!: string;
    private toyType!: ToyType;
    private ageGroup!: AgeGroup;
    private brand!: Brand;
    private material!: Material;
    private batteryRequired!: BatteryRequired;
    private educational!: Educational;
    private price!: number;
    private quantity!: number;

    setOrderId(orderId: string): ToyBuilder {
        this.orderId = orderId;
        return this;
    }

    setToyType(toyType: ToyType): ToyBuilder {
        this.toyType = toyType;
        return this;
    }

    setAgeGroup(ageGroup: AgeGroup): ToyBuilder {
        this.ageGroup = ageGroup;
        return this;
    }

    setBrand(brand: Brand): ToyBuilder {
        this.brand = brand;
        return this;
    }

    setMaterial(material: Material): ToyBuilder {
        this.material = material;
        return this;
    }

    setBatteryRequired(batteryRequired: BatteryRequired): ToyBuilder {
        this.batteryRequired = batteryRequired;
        return this;
    }

    setEducational(educational: Educational): ToyBuilder {
        this.educational = educational;
        return this;
    }

    setPrice(price: number): ToyBuilder {
        this.price = price;
        return this;
    }

    setQuantity(quantity: number): ToyBuilder {
        this.quantity = quantity;
        return this;
    }

    build(): Toy {
        const reqProperties = [
            this.orderId,
            this.toyType,
            this.ageGroup,
            this.brand,
            this.material,
            this.batteryRequired,
            this.educational,
            this.price,
            this.quantity
        ];

        for (const prop of reqProperties) {
            if (prop === undefined) {
                logger.error("Missing required property: " + prop);
                throw new Error("Missing required property: " + prop);
            }
        }

        return new Toy(
            this.orderId,
            this.toyType,
            this.ageGroup,
            this.brand,
            this.material,
            this.batteryRequired,
            this.educational,
            this.price,
            this.quantity
        );
    }
}