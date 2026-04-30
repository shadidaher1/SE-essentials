import { CakeBuilder } from "../../Model/builders/cake.builder";

describe("CakeBuilder", () => {
  it("builds a Cake object with all required fields", () => {
    const cake = new CakeBuilder()
      .setCakeType("Sponge")
      .setFlavor("Vanilla")
      .setFilling("Cream")
      .setSize(20)
      .setLayers(2)
      .setFrostingType("Buttercream")
      .setFrostingFlavor("Vanilla")
      .setDecorationType("Sprinkles")
      .setDecorationColor("Multi-color")
      .setCustomMessage("Happy Birthday")
      .setShape("Round")
      .setAllergies("None")
      .setSpecialIngredients("None")
      .setPackagingType("Standard Box")
      .build();

    expect(cake.getCakeType()).toBe("Sponge");
    expect(cake.getFlavor()).toBe("Vanilla");
    expect(cake.getSize()).toBe(20);
    expect(cake.getLayers()).toBe(2);
  });

  it("throws when a required Cake field is missing", () => {
    const cakeBuilder = new CakeBuilder()
      .setCakeType("Sponge")
      .setFlavor("Vanilla")
      .setFilling("Cream")
      .setSize(20)
      .setLayers(2)
      .setFrostingType("Buttercream")
      .setFrostingFlavor("Vanilla")
      .setDecorationType("Sprinkles")
      .setDecorationColor("Multi-color")
      .setCustomMessage("Happy Birthday")
      .setShape("Round")
      .setAllergies("None")
      .setSpecialIngredients("None");

    expect(() => cakeBuilder.build()).toThrow("Missing required property");
  });

  it("enforces compile-time type safety for CakeBuilder setters", () => {
    const cakeBuilder = new CakeBuilder();

    // @ts-expect-error invalid cake type should be rejected by TypeScript
    cakeBuilder.setCakeType("Invalid Type");

    // @ts-expect-error invalid size type should be rejected by TypeScript
    cakeBuilder.setSize("Large");

    expect(cakeBuilder).toBeInstanceOf(CakeBuilder);
  });
});