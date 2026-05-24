import { IdentifiableToyBuilder, ToyBuilder } from "../Model/builders/toy.builder";
import Toy, { AgeGroup, BatteryRequired, Brand, Educational, IdetifiableToy, Material, ToyType } from "../Model/Toy.Model";
import { IMapper } from "./IMapper";

export class CSVToyMapper implements IMapper<string[], Toy> {
    map(input: string[]): Toy {
        return new ToyBuilder()
            .setToyType(input[1] as any)
            .setAgeGroup(input[2] as any)
            .setBrand(input[3] as any)
            .setMaterial(input[4] as any)
            .setBatteryRequired(input[5] as any)
            .setEducational(input[6] as any)
            .setPrice(parseFloat(input[7]))
            .setQuantity(parseInt(input[8]))
            .build();
    }
        reverseMap(input: Toy): string[] {
        return [
            input.getToyType(),
            input.getAgeGroup(),
            input.getBrand(),
            input.getMaterial(),
            input.getBatteryRequired(),
            input.getEducational(),
            String(input.getPrice()),
            String(input.getQuantity())
        ]
    }
}

function getXmlValue(input: any, key: string): string {
    const value = input?.[key];
    return Array.isArray(value) ? value[0] : value;
}

export class JSONToyMapper implements IMapper<any, Toy> {
    map(input: any): Toy {
        return new ToyBuilder()
            .setToyType(input["Type"] as any)
            .setAgeGroup(input["AgeGroup"] as any)
            .setBrand(input["Brand"] as any)
            .setMaterial(input["Material"] as any)
            .setBatteryRequired(input["BatteryRequired"] as any)
            .setEducational(input["Educational"] as any)
            .setPrice(parseFloat(input["Price"]))
            .setQuantity(parseInt(input["Quantity"]))
            .build();
    }
    reverseMap(input: Toy): string[] {
        return [
            input.getToyType(),
            input.getAgeGroup(),
            input.getBrand(),
            input.getMaterial(),
            input.getBatteryRequired(),
            input.getEducational(),
            String(input.getPrice()),
            String(input.getQuantity())
        ]
    }
}

export class XMLToyMapper implements IMapper<any, Toy> {
    map(input: any): Toy {
        return new ToyBuilder()
            .setToyType(getXmlValue(input, "Type") as any)
            .setAgeGroup(getXmlValue(input, "AgeGroup") as any)
            .setBrand(getXmlValue(input, "Brand") as any)
            .setMaterial(getXmlValue(input, "Material") as any)
            .setBatteryRequired(getXmlValue(input, "BatteryRequired") as any)
            .setEducational(getXmlValue(input, "Educational") as any)
            .setPrice(parseFloat(getXmlValue(input, "Price")))
            .setQuantity(parseInt(getXmlValue(input, "Quantity")))
            .build();
    }
    reverseMap(input: Toy): string[] {
        return [
            input.getToyType(),
            input.getAgeGroup(),
            input.getBrand(),
            input.getMaterial(),
            input.getBatteryRequired(),
            input.getEducational(),
            String(input.getPrice()),
            String(input.getQuantity())
        ]
    }

}

export interface SQLiteToy {
    id: string;
    toyType: ToyType;
    ageGroup: AgeGroup;
    brand: Brand;
    material: Material;
    batteryRequired: BatteryRequired;
    educational: Educational;
    price: number;
    quantity: number;
}

export class SQLiteToyMapper implements IMapper<SQLiteToy, IdetifiableToy> {
    map(input: SQLiteToy): IdetifiableToy {
        return IdentifiableToyBuilder.newBuilder()
            .setID(input.id)
            .setToy(ToyBuilder.newBuilder()
                .setToyType(input.toyType)
                .setAgeGroup(input.ageGroup)
                .setBrand(input.brand)
                .setMaterial(input.material)
                .setBatteryRequired(input.batteryRequired)
                .setEducational(input.educational)
                .setPrice(input.price)
                .setQuantity(input.quantity)
                .build())
            .build();
    }
    reverseMap(input: IdetifiableToy): SQLiteToy {
        return {
            id: input.getID(),
            toyType: input.getToyType(),
            ageGroup: input.getAgeGroup(),
            brand: input.getBrand(),
            material: input.getMaterial(),
            batteryRequired: input.getBatteryRequired(),
            educational: input.getEducational(),
            price: input.getPrice(),
            quantity: input.getQuantity()
        }
    }
}   
