import { BookBuilder } from "../../Model/builders/book.builder";

describe("BookBuilder", () => {
  it("builds a Book object with all required fields", () => {
    const book = new BookBuilder()
      .setOrderId("B001")
      .setBookTitle("The Great Gatsby")
      .setAuthor("F. Scott Fitzgerald")
      .setGenre("Historical Fiction")
      .setFormat("Paperback")
      .setLanguage("English")
      .setPublisher("Penguin Random House")
      .setSpecialEdition("None")
      .setPackaging("Standard Wrap")
      .setPrice(15.99)
      .setQuantity(1)
      .build();

    expect(book.getOrderId()).toBe("B001");
    expect(book.getBookTitle()).toBe("The Great Gatsby");
    expect(book.getPrice()).toBe(15.99);
    expect(book.getQuantity()).toBe(1);
  });

  it("throws when a required Book field is missing", () => {
    const bookBuilder = new BookBuilder()
      .setOrderId("B001")
      .setBookTitle("The Great Gatsby")
      .setAuthor("F. Scott Fitzgerald")
      .setGenre("Historical Fiction")
      .setFormat("Paperback")
      .setLanguage("English")
      .setPublisher("Penguin Random House")
      .setSpecialEdition("None")
      .setPackaging("Standard Wrap")
      .setPrice(15.99);

    expect(() => bookBuilder.build()).toThrow("Missing required property");
  });

  it("enforces compile-time type safety for BookBuilder setters", () => {
    const bookBuilder = new BookBuilder();

    // @ts-expect-error invalid genre should be rejected by TypeScript
    bookBuilder.setGenre("Comedy");

    // @ts-expect-error invalid price type should be rejected by TypeScript
    bookBuilder.setPrice("15.99");

    expect(bookBuilder).toBeInstanceOf(BookBuilder);
  });
});