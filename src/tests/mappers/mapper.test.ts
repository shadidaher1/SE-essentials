import { CSVCakeMapper, JSONCakeMapper, XMLCakeMapper } from "../../mappers/Cake.mapper";
import { CSVBookMapper, JSONBookMapper, XMLBookMapper } from "../../mappers/Book.mapper";
import { CSVToyMapper, JSONToyMapper, XMLToyMapper } from "../../mappers/Toy.mapper";

describe("Mapper implementations", () => {
  it("maps cake CSV rows into Cake objects", () => {
    const mapper = new CSVCakeMapper();
    const cake = mapper.map([
      "0",
      "Sponge",
      "Vanilla",
      "Cream",
      "20",
      "2",
      "Buttercream",
      "Vanilla",
      "Sprinkles",
      "Multi-color",
      "Happy Birthday",
      "Round",
      "Nut-Free",
      "Organic Ingredients",
      "Standard Box"
    ]);

    expect(cake.getCakeType()).toBe("Sponge");
    expect(cake.getFlavor()).toBe("Vanilla");
    expect(cake.getSize()).toBe(20);
    expect(cake.getLayers()).toBe(2);
  });

  it("maps book JSON objects into Book objects", () => {
    const mapper = new JSONBookMapper();
    const book = mapper.map({
      "Order ID": "2001",
      "Book Title": "Edge of Eternity",
      "Author": "Dan Brown",
      "Genre": "Science Fiction",
      "Format": "Paperback",
      "Language": "French",
      "Publisher": "Oxford Press",
      "Special Edition": "Signed Copy",
      "Packaging": "Eco-Friendly Packaging",
      "Price": "12",
      "Quantity": "5"
    });

    expect(book.getOrderId()).toBe("2001");
    expect(book.getBookTitle()).toBe("Edge of Eternity");
    expect(book.getPrice()).toBe(12);
    expect(book.getQuantity()).toBe(5);
  });

  it("maps toy XML objects into Toy objects", () => {
    const mapper = new XMLToyMapper();
    const toy = mapper.map({
      OrderID: ["5001"],
      Type: ["Plush Toy"],
      AgeGroup: ["13+"],
      Brand: ["FunTime"],
      Material: ["Fabric"],
      BatteryRequired: ["Yes"],
      Educational: ["Yes"],
      Price: ["247"],
      Quantity: ["7"]
    });

    expect(toy.getOrderId()).toBe("5001");
    expect(toy.getToyType()).toBe("Plush Toy");
    expect(toy.getPrice()).toBe(247);
    expect(toy.getQuantity()).toBe(7);
  });

  it("maps toy CSV rows into Toy objects", () => {
    const mapper = new CSVToyMapper();
    const toy = mapper.map(["5001", "Plush Toy", "13+", "FunTime", "Fabric", "Yes", "Yes", "247", "7"]);

    expect(toy.getOrderId()).toBe("5001");
    expect(toy.getToyType()).toBe("Plush Toy");
    expect(toy.getMaterial()).toBe("Fabric");
    expect(toy.getQuantity()).toBe(7);
  });

  it("maps cake XML objects into Cake objects", () => {
    const mapper = new XMLCakeMapper();
    const cake = mapper.map({
      Type: ["Chocolate"],
      Flavor: ["Chocolate"],
      Filling: ["Ganache"],
      Size: ["25"],
      Layers: ["3"],
      "Frosting Type": ["Fondant"],
      "Frosting Flavor": ["Chocolate"],
      "Decoration Type": ["Gold Flakes"],
      "Decoration Color": ["Gold"],
      "Custom Message": ["Happy Graduation"],
      Shape: ["Round"],
      Allergies: ["Gluten-Free"],
      "Special Ingredients": ["None"],
      "Packaging Type": ["Luxury Box"]
    });

    expect(cake.getCakeType()).toBe("Chocolate");
    expect(cake.getSize()).toBe(25);
    expect(cake.getLayers()).toBe(3);
    expect(cake.getFrostingType()).toBe("Fondant");
  });
});
