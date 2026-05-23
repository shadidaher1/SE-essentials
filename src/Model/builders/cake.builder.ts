
import logger from "../../util/logger";
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
    IdetifiableCake
} from "../Cake.Model";
import Cake from "../Cake.Model";

export class CakeBuilder {
     private cakeType!: Type;
    private flavor!: Flavor;
    private filling!: Filling;
    private size!: number;
    private layers!: number;
    private frostingType!: FrostingType;
    private frostingFlavor!: FrostingFlavor;
    private decorationType!: DecorationType;
    private decorationColor!: DecorationColor;
    private customMessage!: string;
    private shape!: Shape;
    private allergies!: Allergies;
    private specialIngredients!: SpecialIngredients;
    private packagingType!: PackagingType;

    // constructor() {
    //     // Initialize with default values
    //     this.cakeType = "Sponge";
    //     this.flavor = "Vanilla";
    //     this.filling = "Cream";
    //     this.size = 20;
    //     this.layers = 2;
    //     this.frostingType = "Buttercream";
    //     this.frostingFlavor = "Vanilla";
    //     this.decorationType = "Sprinkles";
    //     this.decorationColor = "Multi-color";
    //     this.customMessage = "";
    //     this.shape = "Round";
    //     this.allergies = "None";
    //     this.specialIngredients = "None";
    //     this.packagingType = "Standard Box";
    // }

    public static newBuilder(): CakeBuilder {
        return new CakeBuilder();
    }

    setCakeType(cakeType: Type): CakeBuilder {
        this.cakeType = cakeType;
        return this;
    }

    setFlavor(flavor: Flavor): CakeBuilder {
        this.flavor = flavor;
        return this;
    }

    setFilling(filling: Filling): CakeBuilder {
        this.filling = filling;
        return this;
    }

    setSize(size: number): CakeBuilder {
        this.size = size;
        return this;
    }

    setLayers(layers: number): CakeBuilder {
        this.layers = layers;
        return this;
    }

    setFrostingType(frostingType: FrostingType): CakeBuilder {
        this.frostingType = frostingType;
        return this;
    }

    setFrostingFlavor(frostingFlavor: FrostingFlavor): CakeBuilder {
        this.frostingFlavor = frostingFlavor;
        return this;
    }

    setDecorationType(decorationType: DecorationType): CakeBuilder {
        this.decorationType = decorationType;
        return this;
    }

    setDecorationColor(decorationColor: DecorationColor): CakeBuilder {
        this.decorationColor = decorationColor;
        return this;
    }

    setCustomMessage(customMessage: string): CakeBuilder {
        this.customMessage = customMessage;
        return this;
    }

    setShape(shape: Shape): CakeBuilder {
        this.shape = shape;
        return this;
    }

    setAllergies(allergies: Allergies): CakeBuilder {
        this.allergies = allergies;
        return this;
    }

    setSpecialIngredients(specialIngredients: SpecialIngredients): CakeBuilder {
        this.specialIngredients = specialIngredients;
        return this;
    }

    setPackagingType(packagingType: PackagingType): CakeBuilder {
        this.packagingType = packagingType;
        return this;
    }
    build(): Cake {
        const reqProperties = [
            this.cakeType,
            this.flavor,
            this.filling,
            this.size,
            this.layers,
            this.frostingType,
            this.frostingFlavor,
            this.decorationType,
            this.decorationColor,
            this.customMessage,
            this.shape,
            this.allergies,
            this.specialIngredients,
            this.packagingType
        ];  
        for (const prop of reqProperties) {
        if (prop === undefined) {
            logger.error("Missing required property: " + prop);
            throw new Error("Missing required property: " + prop);
        }
    }
        
        return new Cake(
            this.cakeType,
            this.flavor,
            this.filling,
            this.size,
            this.layers,
            this.frostingType,
            this.frostingFlavor,
            this.decorationType,
            this.decorationColor,
            this.customMessage,
            this.shape,
            this.allergies,
            this.specialIngredients,
            this.packagingType
        );
    }
}
export class IdetifiableCakeBuilder {
    private id!: string;
    private cake!: Cake;

    static newBuilder(): IdetifiableCakeBuilder {
        return new IdetifiableCakeBuilder();
    }
    setId(id: string): IdetifiableCakeBuilder {
        this.id = id;
        return this;
    }
    setCake(cake: Cake): IdetifiableCakeBuilder {
        this.cake = cake;
        return this;
    }
    build(): IdetifiableCake {
        if (this.id === undefined || this.cake === undefined) {
            logger.error("Missing required property: id or cake");
            throw new Error("Missing required property: id or cake");
        }
        return new IdetifiableCake(
            this.id,
            this.cake.getCakeType(),
            this.cake.getFlavor(),
            this.cake.getFilling(),
            this.cake.getSize(),
            this.cake.getLayers(),
            this.cake.getFrostingType(),
            this.cake.getFrostingFlavor(),
            this.cake.getDecorationType(),
            this.cake.getDecorationColor(),
            this.cake.getCustomMessage(),
            this.cake.getShape(),
            this.cake.getAllergies(),
            this.cake.getSpecialIngredients(),
            this.cake.getPackagingType()
        );
    }

}