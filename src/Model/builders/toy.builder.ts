import logger from "../../util/logger";
import {
    ToyType,
    AgeGroup,
    Brand,
    Material,
    BatteryRequired,
    Educational,
    IdetifiableToy
} from "../Toy.Model";
import Toy from "../Toy.Model";

export class ToyBuilder {

    private toyType!: ToyType;
    private ageGroup!: AgeGroup;
    private brand!: Brand;
    private material!: Material;
    private batteryRequired!: BatteryRequired;
    private educational!: Educational;
    private price!: number;
    private quantity!: number;

    public static newBuilder(): ToyBuilder {
        return new ToyBuilder();
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

export class IdentifiableToyBuilder {
    private id!: string;
    private Toy!: Toy;


    static newBuilder(): IdentifiableToyBuilder {
        return new IdentifiableToyBuilder();
    }
    setID(id: string): IdentifiableToyBuilder {
        this.id = id;
        return this;
    }

    setToy(Toy: Toy): IdentifiableToyBuilder {
        this.Toy = Toy;
        return this;
    }
    build(): IdetifiableToy {
        if (!this.id) {
            logger.error("Missing required property: id");
            throw new Error("Missing required property: id");
        }
        if (!this.Toy) {
            logger.error("Missing required property: Toy");
            throw new Error("Missing required property: Toy");
        }
        return new IdetifiableToy(
            this.id,
            this.Toy.getToyType(),
            this.Toy.getAgeGroup(),
            this.Toy.getBrand(),
            this.Toy.getMaterial(),
            this.Toy.getBatteryRequired(),
            this.Toy.getEducational(),
            this.Toy.getPrice(),
            this.Toy.getQuantity()
        );
    }
}