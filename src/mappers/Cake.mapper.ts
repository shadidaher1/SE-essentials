import { CakeBuilder, IdetifiableCakeBuilder } from "../Model/builders/cake.builder";
import Cake, { IdetifiableCake } from "../Model/Cake.Model";
import { IMapper } from "./IMapper";
import {
    Type,
    Flavor,
    Filling,
    FrostingType,
    FrostingFlavor,
    DecorationType,
    DecorationColor,
    Shape,
    Allergies,
    SpecialIngredients,
    PackagingType,
} from "../Model/Cake.Model";

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
    reverseMap(input: Cake): string[] {
        return [
            input.getCakeType(),
            input.getFlavor(),
            input.getFilling(),
            String(input.getSize()),
            String(input.getLayers()),
            input.getFrostingType(),
            input.getFrostingFlavor(),
            input.getDecorationType(),
            input.getDecorationColor(),
            input.getCustomMessage(),
            input.getShape(),
            input.getAllergies(),
            input.getSpecialIngredients(),
            input.getPackagingType()
        ]
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
    reverseMap(input: Cake): string[] {
        return [
            input.getCakeType(),
            input.getFlavor(),
            input.getFilling(),
            String(input.getSize()),
            String(input.getLayers()),
            input.getFrostingType(),
            input.getFrostingFlavor(),
            input.getDecorationType(),
            input.getDecorationColor(),
            input.getCustomMessage(),
            input.getShape(),
            input.getAllergies(),
            input.getSpecialIngredients(),
            input.getPackagingType()
        ];
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
    reverseMap(input: Cake): string[] {
        return [
            input.getCakeType(),
            input.getFlavor(),
            input.getFilling(),
            String(input.getSize()),
            String(input.getLayers()),
            input.getFrostingType(),
            input.getFrostingFlavor(),
            input.getDecorationType(),
            input.getDecorationColor(),
            input.getCustomMessage(),
            input.getShape(),
            input.getAllergies(),
            input.getSpecialIngredients(),
            input.getPackagingType()
        ];
    }
}
export interface SQLiteCake {
   

    cakeType: Type;   // ✅ was: type: Type
    flavor: Flavor;
    filling: Filling;
    size: number;
    layers: number;
    frostingType: FrostingType;
    frostingFlavor: FrostingFlavor;
    decorationType: DecorationType;
    decorationColor: DecorationColor;
    customMessage: string;
    shape: Shape;
    allergies: Allergies;
    specialIngredients: SpecialIngredients;
    packagingType: PackagingType;
    id: string;
}

export class SQLiteCakeMapper implements IMapper<SQLiteCake, IdetifiableCake> {
    map(input: SQLiteCake): IdetifiableCake {
        return IdetifiableCakeBuilder.newBuilder()
            .setCake(CakeBuilder.newBuilder()
                .setCakeType(input.cakeType)
                .setFlavor(input.flavor)
                .setFilling(input.filling)
                .setSize(input.size)
                .setLayers(input.layers)
                .setFrostingType(input.frostingType)
                .setFrostingFlavor(input.frostingFlavor)
                .setDecorationType(input.decorationType)
                .setDecorationColor(input.decorationColor)
                .setCustomMessage(input.customMessage)
                .setShape(input.shape)
                .setAllergies(input.allergies)
                .setSpecialIngredients(input.specialIngredients)
                .setPackagingType(input.packagingType)
                .build())
            .setId(input.id)
            .build();
            
    }
    reverseMap(input: IdetifiableCake): SQLiteCake {
       return {
        id: input.getID(),
        cakeType: input.getCakeType(),
        flavor: input.getFlavor(),
        filling: input.getFilling(),
        size: input.getSize(),
        layers: input.getLayers(),
        frostingType: input.getFrostingType(),
        frostingFlavor: input.getFrostingFlavor(),
        decorationType: input.getDecorationType(),
        decorationColor: input.getDecorationColor(),
        customMessage: input.getCustomMessage(),
        shape: input.getShape(),
        allergies: input.getAllergies(),
        specialIngredients: input.getSpecialIngredients(),
        packagingType: input.getPackagingType()
       }

    }

}