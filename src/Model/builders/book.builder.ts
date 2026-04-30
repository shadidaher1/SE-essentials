import logger from "../../util/logger";
import {
    Genre,
    Format,
    Language,
    Publisher,
    SpecialEdition,
    Packaging
} from "../Book.Model";
import Book from "../Book.Model";

export class BookBuilder {
    private orderId!: string;
    private bookTitle!: string;
    private author!: string;
    private genre!: Genre;
    private format!: Format;
    private language!: Language;
    private publisher!: Publisher;
    private specialEdition!: SpecialEdition;
    private packaging!: Packaging;
    private price!: number;
    private quantity!: number;

    setOrderId(orderId: string): BookBuilder {
        this.orderId = orderId;
        return this;
    }

    setBookTitle(bookTitle: string): BookBuilder {
        this.bookTitle = bookTitle;
        return this;
    }

    setAuthor(author: string): BookBuilder {
        this.author = author;
        return this;
    }

    setGenre(genre: Genre): BookBuilder {
        this.genre = genre;
        return this;
    }

    setFormat(format: Format): BookBuilder {
        this.format = format;
        return this;
    }

    setLanguage(language: Language): BookBuilder {
        this.language = language;
        return this;
    }

    setPublisher(publisher: Publisher): BookBuilder {
        this.publisher = publisher;
        return this;
    }

    setSpecialEdition(specialEdition: SpecialEdition): BookBuilder {
        this.specialEdition = specialEdition;
        return this;
    }

    setPackaging(packaging: Packaging): BookBuilder {
        this.packaging = packaging;
        return this;
    }

    setPrice(price: number): BookBuilder {
        this.price = price;
        return this;
    }

    setQuantity(quantity: number): BookBuilder {
        this.quantity = quantity;
        return this;
    }

    build(): Book {
        const reqProperties = [
            this.orderId,
            this.bookTitle,
            this.author,
            this.genre,
            this.format,
            this.language,
            this.publisher,
            this.specialEdition,
            this.packaging,
            this.price,
            this.quantity
        ];

        for (const prop of reqProperties) {
            if (prop === undefined) {
                logger.error("Missing required property: " + prop);
                throw new Error("Missing required property: " + prop);
            }
        }

        return new Book(
            this.orderId,
            this.bookTitle,
            this.author,
            this.genre,
            this.format,
            this.language,
            this.publisher,
            this.specialEdition,
            this.packaging,
            this.price,
            this.quantity
        );
    }
}