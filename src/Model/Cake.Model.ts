import { Item, ItemCategory } from "./Item.Model";

type Type = "Sponge" | "Chocolate" | "Fruit" | "Red Velvet" | "Birthday" | "Coffee" | "Carrot" | "Marble";
type Flavor = "Vanilla" | "Chocolate" | "Lemon" | "Strawberry" | "Red Velvet" | "Pineapple" | "Caramel" | "Coffee" | "Dark Chocolate";
type Filling = "Cream" | "Ganache" | "Jam" | "Cream Cheese" | "Fruit" | "Mousse" | "Custard" | "Strawberry Jam";
type FrostingType = "Buttercream" | "Fondant" | "Whipped Cream" | "Ganache";
type FrostingFlavor = "Vanilla" | "Chocolate" | "Lemon" | "Strawberry" | "Red Velvet" | "Pineapple" | "Caramel" | "Coffee";
type DecorationType = "Sprinkles" | "Fondant Figures" | "Edible Flowers" | "Edible Glitter" | "Edible Beads" | "Custom Shapes" | "Fruit Slices" | "Gold Flakes" | "Edible Letters" | "Flowers";
type DecorationColor = "Multi-color" | "Red" | "Yellow" | "Gold" | "Pink" | "White" | "Brown" | "Blue" | "Silver" | "Purple";
type Shape = "Round" | "Square" | "Heart-Shaped" | "Oval" | "Rectangle";
type Allergies = "Nut-Free" | "Gluten-Free" | "Dairy-Free" | "None";
type SpecialIngredients = "Organic Ingredients" | "Vegan" | "Sugar-Free" | "Organic" | "None" | "Edible Gold Dust";
type PackagingType = "Standard Box" | "Luxury Box with Ribbon" | "Luxury Box" | "Standard Box with Ribbon" | "Box";

class Cake implements Item {
    private cakeType: Type;
    private flavor: Flavor;
    private filling: Filling;
    private size: number;
    private layers: number;
    private frostingType: FrostingType;
    private frostingFlavor: FrostingFlavor;
    private decorationType: DecorationType;
    private decorationColor: DecorationColor;
    private customMessage: string;
    private shape: Shape;
    private allergies: Allergies;
    private specialIngredients: SpecialIngredients;
    private packagingType: PackagingType;

    constructor(
        cakeType: Type,
        flavor: Flavor,
        filling: Filling,
        size: number,
        layers: number,
        frostingType: FrostingType,
        frostingFlavor: FrostingFlavor,
        decorationType: DecorationType,
        decorationColor: DecorationColor,
        customMessage: string,
        shape: Shape,
        allergies: Allergies,
        specialIngredients: SpecialIngredients,
        packagingType: PackagingType
    ) {
        this.cakeType = cakeType;
        this.flavor = flavor;
        this.filling = filling;
        this.size = size;
        this.layers = layers;
        this.frostingType = frostingType;
        this.frostingFlavor = frostingFlavor;
        this.decorationType = decorationType;
        this.decorationColor = decorationColor;
        this.customMessage = customMessage;
        this.shape = shape;
        this.allergies = allergies;
        this.specialIngredients = specialIngredients;
        this.packagingType = packagingType;
    }

    getCategory(): ItemCategory {
        return ItemCategory.CAKE;
    }

    getCakeType(): Type {
        return this.cakeType;
    }

    setCakeType(cakeType: Type): void {
        this.cakeType = cakeType;
    }

    getFlavor(): Flavor {
        return this.flavor;
    }

    setFlavor(flavor: Flavor): void {
        this.flavor = flavor;
    }

    getFilling(): Filling {
        return this.filling;
    }

    setFilling(filling: Filling): void {
        this.filling = filling;
    }

    getSize(): number {
        return this.size;
    }

    setSize(size: number): void {
        this.size = size;
    }

    getLayers(): number {
        return this.layers;
    }

    setLayers(layers: number): void {
        this.layers = layers;
    }

    getFrostingType(): FrostingType {
        return this.frostingType;
    }

    setFrostingType(frostingType: FrostingType): void {
        this.frostingType = frostingType;
    }

    getFrostingFlavor(): FrostingFlavor {
        return this.frostingFlavor;
    }

    setFrostingFlavor(frostingFlavor: FrostingFlavor): void {
        this.frostingFlavor = frostingFlavor;
    }

    getDecorationType(): DecorationType {
        return this.decorationType;
    }

    setDecorationType(decorationType: DecorationType): void {
        this.decorationType = decorationType;
    }

    getDecorationColor(): DecorationColor {
        return this.decorationColor;
    }

    setDecorationColor(decorationColor: DecorationColor): void {
        this.decorationColor = decorationColor;
    }

    getCustomMessage(): string {
        return this.customMessage;
    }

    setCustomMessage(customMessage: string): void {
        this.customMessage = customMessage;
    }

    getShape(): Shape {
        return this.shape;
    }

    setShape(shape: Shape): void {
        this.shape = shape;
    }

    getAllergies(): Allergies {
        return this.allergies;
    }

    setAllergies(allergies: Allergies): void {
        this.allergies = allergies;
    }

    getSpecialIngredients(): SpecialIngredients {
        return this.specialIngredients;
    }

    setSpecialIngredients(specialIngredients: SpecialIngredients): void {
        this.specialIngredients = specialIngredients;
    }

    getPackagingType(): PackagingType {
        return this.packagingType;
    }
}

export default Cake;