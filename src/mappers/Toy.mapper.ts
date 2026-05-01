import { ToyBuilder } from "../Model/builders/toy.builder";
import Toy from "../Model/Toy.Model";
import { IMapper } from "./IMapper";

export class CSVToyMapper implements IMapper<string[], Toy> {
    map(input: string[]): Toy {
        return new ToyBuilder()
            .setOrderId(input[0])
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
}

function getXmlValue(input: any, key: string): string {
    const value = input?.[key];
    return Array.isArray(value) ? value[0] : value;
}

export class JSONToyMapper implements IMapper<any, Toy> {
    map(input: any): Toy {
        return new ToyBuilder()
            .setOrderId(input["OrderID"])
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
}

export class XMLToyMapper implements IMapper<any, Toy> {
    map(input: any): Toy {
        return new ToyBuilder()
            .setOrderId(getXmlValue(input, "OrderID"))
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
}
