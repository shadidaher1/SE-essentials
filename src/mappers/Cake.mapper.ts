import { CakeBuilder } from "../Model/builders/cake.builder";
import Cake from "../Model/Cake.Model";
import { IMapper } from "./IMapper";

export class CSVCakeMapper implements IMapper<string[], Cake> {
    map(input: string[]): Cake {
        return CakeBuilder.newBuilder()
            .setCakeType(input[1] as any)
            .setFlavor(input[2] as any)
            .setFilling(input[3] as any)
            .setSize(parseInt(input[4]))
            .setLayers(parseInt(input[5]))
            .setFrostingType(input[6] as any)
            .setFrostingFlavor(input[7] as any)
            .setDecorationType(input[8] as any)
            .setDecorationColor(input[9] as any)
            .setCustomMessage(input[10])
            .setShape(input[11] as any)
            .setAllergies(input[12] as any)
            .setSpecialIngredients(input[13] as any)
            .setPackagingType(input[14] as any)
            .build();
    }
}

function getXmlValue(input: any, key: string): string {
    const value = input?.[key];
    return Array.isArray(value) ? value[0] : value;
}

export class JSONCakeMapper implements IMapper<any, Cake> {
    map(input: any): Cake {
        return CakeBuilder.newBuilder()
            .setCakeType(input["Type"] as any)
            .setFlavor(input["Flavor"] as any)
            .setFilling(input["Filling"] as any)
            .setSize(parseInt(input["Size"]))
            .setLayers(parseInt(input["Layers"]))
            .setFrostingType(input["Frosting Type"] as any)
            .setFrostingFlavor(input["Frosting Flavor"] as any)
            .setDecorationType(input["Decoration Type"] as any)
            .setDecorationColor(input["Decoration Color"] as any)
            .setCustomMessage(input["Custom Message"])
            .setShape(input["Shape"] as any)
            .setAllergies(input["Allergies"] as any)
            .setSpecialIngredients(input["Special Ingredients"] as any)
            .setPackagingType(input["Packaging Type"] as any)
            .build();
    }
}

export class XMLCakeMapper implements IMapper<any, Cake> {
    map(input: any): Cake {
        return CakeBuilder.newBuilder()
            .setCakeType(getXmlValue(input, "Type") as any)
            .setFlavor(getXmlValue(input, "Flavor") as any)
            .setFilling(getXmlValue(input, "Filling") as any)
            .setSize(parseInt(getXmlValue(input, "Size")))
            .setLayers(parseInt(getXmlValue(input, "Layers")))
            .setFrostingType(getXmlValue(input, "Frosting Type") as any)
            .setFrostingFlavor(getXmlValue(input, "Frosting Flavor") as any)
            .setDecorationType(getXmlValue(input, "Decoration Type") as any)
            .setDecorationColor(getXmlValue(input, "Decoration Color") as any)
            .setCustomMessage(getXmlValue(input, "Custom Message"))
            .setShape(getXmlValue(input, "Shape") as any)
            .setAllergies(getXmlValue(input, "Allergies") as any)
            .setSpecialIngredients(getXmlValue(input, "Special Ingredients") as any)
            .setPackagingType(getXmlValue(input, "Packaging Type") as any)
            .build();
    }
}
