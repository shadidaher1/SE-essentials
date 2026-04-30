import { Item, ItemCategory } from "./Item.Model";

export type Genre = "Science Fiction" | "Thriller" | "Biography" | "Mystery" | "Fantasy" | "Romance" | "Historical Fiction" | "Non-Fiction";
export type Format = "Paperback" | "Hardcover" | "Audiobook" | "E-Book";
export type Language = "French" | "Spanish" | "Japanese" | "English" | "Chinese" | "German";
export type Publisher = "Oxford Press" | "Hachette Book Group" | "Macmillan Publishers" | "Scholastic" | "Simon & Schuster" | "HarperCollins" | "Penguin Random House";
export type SpecialEdition = "Signed Copy" | "Limited Edition" | "None" | "Collector's Edition" | "Illustrated Edition";
export type Packaging = "Eco-Friendly Packaging" | "Standard Wrap" | "Luxury Box" | "Gift Wrap";

class Book implements Item {
    private orderId: string;
    private bookTitle: string;
    private author: string;
    private genre: Genre;
    private format: Format;
    private language: Language;
    private publisher: Publisher;
    private specialEdition: SpecialEdition;
    private packaging: Packaging;
    private price: number;
    private quantity: number;

    constructor(
        orderId: string,
        bookTitle: string,
        author: string,
        genre: Genre,
        format: Format,
        language: Language,
        publisher: Publisher,
        specialEdition: SpecialEdition,
        packaging: Packaging,
        price: number,
        quantity: number
    ) {
        this.orderId = orderId;
        this.bookTitle = bookTitle;
        this.author = author;
        this.genre = genre;
        this.format = format;
        this.language = language;
        this.publisher = publisher;
        this.specialEdition = specialEdition;
        this.packaging = packaging;
        this.price = price;
        this.quantity = quantity;
    }

    getCategory(): ItemCategory {
        return ItemCategory.BOOK;
    }

    getOrderId(): string {
        return this.orderId;
    }

    getBookTitle(): string {
        return this.bookTitle;
    }

    getAuthor(): string {
        return this.author;
    }

    getGenre(): Genre {
        return this.genre;
    }

    getFormat(): Format {
        return this.format;
    }

    getLanguage(): Language {
        return this.language;
    }

    getPublisher(): Publisher {
        return this.publisher;
    }

    getSpecialEdition(): SpecialEdition {
        return this.specialEdition;
    }

    getPackaging(): Packaging {
        return this.packaging;
    }

    getPrice(): number {
        return this.price;
    }

    getQuantity(): number {
        return this.quantity;
    }
}

export default Book;
