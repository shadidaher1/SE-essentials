import { ToyBuilder } from "../../Model/builders/toy.builder";

describe("ToyBuilder", () => {
  it("builds a Toy object with all required fields", () => {
    const toy = new ToyBuilder()
      .setOrderId("T001")
      .setToyType("Action Figure")
      .setAgeGroup("8-12")
      .setBrand("Adventure Co.")
      .setMaterial("Plastic")
      .setBatteryRequired("No")
      .setEducational("No")
      .setPrice(25.5)
      .setQuantity(1)
      .build();

    expect(toy.getOrderId()).toBe("T001");
    expect(toy.getToyType()).toBe("Action Figure");
    expect(toy.getPrice()).toBe(25.5);
    expect(toy.getQuantity()).toBe(1);
  });

  it("throws when a required Toy field is missing", () => {
    const toyBuilder = new ToyBuilder()
      .setOrderId("T001")
      .setToyType("Action Figure")
      .setAgeGroup("8-12")
      .setBrand("Adventure Co.")
      .setMaterial("Plastic")
      .setBatteryRequired("No")
      .setEducational("No")
      .setPrice(25.5);

    expect(() => toyBuilder.build()).toThrow("Missing required property");
  });

  it("enforces compile-time type safety for ToyBuilder setters", () => {
    const toyBuilder = new ToyBuilder();

    // @ts-expect-error invalid toy type should be rejected by TypeScript
    toyBuilder.setToyType("Electric Car");

    // @ts-expect-error invalid quantity type should be rejected by TypeScript
    toyBuilder.setQuantity("one");

    expect(toyBuilder).toBeInstanceOf(ToyBuilder);
  });
});