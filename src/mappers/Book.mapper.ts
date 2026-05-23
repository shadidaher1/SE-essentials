import { BookBuilder } from "../Model/builders/book.builder";
import Book from "../Model/Book.Model";
import { IMapper } from "./IMapper";

export class CSVBookMapper implements IMapper<string[], Book> {
    map(input: string[]): Book {
        return new BookBuilder()
            .setOrderId(input[0])
            .setBookTitle(input[1])
            .setAuthor(input[2])
            .setGenre(input[3] as any)
            .setFormat(input[4] as any)
            .setLanguage(input[5] as any)
            .setPublisher(input[6] as any)
            .setSpecialEdition(input[7] as any)
            .setPackaging(input[8] as any)
            .setPrice(parseFloat(input[9]))
            .setQuantity(parseInt(input[10]))
            .build();
    }
    reverseMap(input: Book): string[] {
        return [
            input.getOrderId(),
            input.getBookTitle(),
            input.getAuthor(),
            input.getGenre(),
            input.getFormat(),
            input.getLanguage(),
            input.getPublisher(),
            input.getSpecialEdition(),
            input.getPackaging(),
            String(input.getPrice()),
            String(input.getQuantity())
        ]
    }
}

function getXmlValue(input: any, key: string): string {
    const value = input?.[key];
    return Array.isArray(value) ? value[0] : value;
}

export class JSONBookMapper implements IMapper<any, Book> {
    map(input: any): Book {
        return new BookBuilder()
            .setOrderId(input["Order ID"])
            .setBookTitle(input["Book Title"])
            .setAuthor(input["Author"])
            .setGenre(input["Genre"] as any)
            .setFormat(input["Format"] as any)
            .setLanguage(input["Language"] as any)
            .setPublisher(input["Publisher"] as any)
            .setSpecialEdition(input["Special Edition"] as any)
            .setPackaging(input["Packaging"] as any)
            .setPrice(parseFloat(input["Price"]))
            .setQuantity(parseInt(input["Quantity"]))
            .build();
    }
    reverseMap(input: Book): string[] {
        return [
            input.getOrderId(),
            input.getBookTitle(),
            input.getAuthor(),
            input.getGenre(),
            input.getFormat(),
            input.getLanguage(),
            input.getPublisher(),
            input.getSpecialEdition(),
            input.getPackaging(),
            String(input.getPrice()),
            String(input.getQuantity())
        ]
    }
}

export class XMLBookMapper implements IMapper<any, Book> {
    map(input: any): Book {
        return new BookBuilder()
            .setOrderId(getXmlValue(input, "OrderID"))
            .setBookTitle(getXmlValue(input, "Book Title"))
            .setAuthor(getXmlValue(input, "Author"))
            .setGenre(getXmlValue(input, "Genre") as any)
            .setFormat(getXmlValue(input, "Format") as any)
            .setLanguage(getXmlValue(input, "Language") as any)
            .setPublisher(getXmlValue(input, "Publisher") as any)
            .setSpecialEdition(getXmlValue(input, "Special Edition") as any)
            .setPackaging(getXmlValue(input, "Packaging") as any)
            .setPrice(parseFloat(getXmlValue(input, "Price")))
            .setQuantity(parseInt(getXmlValue(input, "Quantity")))
            .build();
    }
        reverseMap(input: Book): string[] { 
        return [
            input.getOrderId(),
            input.getBookTitle(),
            input.getAuthor(),
            input.getGenre(),
            input.getFormat(),
            input.getLanguage(),
            input.getPublisher(),
            input.getSpecialEdition(),
            input.getPackaging(),
            String(input.getPrice()),
            String(input.getQuantity())
        ]
    }
}
