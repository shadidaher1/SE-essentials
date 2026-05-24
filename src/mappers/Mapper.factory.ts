import { ItemCategory } from "../Model/IItem";
import { IMapper } from "./IMapper";

// Cake mappers
import { CSVCakeMapper, JSONCakeMapper, XMLCakeMapper, SQLiteCakeMapper } from "./Cake.mapper";

// Book mappers
import { CSVBookMapper, JSONBookMapper, XMLBookMapper, SQLiteBookMapper } from "./Book.mapper";

// Toy mappers
import { CSVToyMapper, JSONToyMapper, XMLToyMapper, SQLiteToyMapper } from "./Toy.mapper";

export enum MapperMode {
    CSV = "csv",
    JSON = "json",
    XML = "xml",
    SQLITE = "sqlite"
}

export class MapperFactory {
    public static create(mode: MapperMode, category: ItemCategory): IMapper<any, any> {
        switch (category) {
            case ItemCategory.CAKE:
                switch (mode) {
                    case MapperMode.CSV:    return new CSVCakeMapper();
                    case MapperMode.JSON:   return new JSONCakeMapper();
                    case MapperMode.XML:    return new XMLCakeMapper();
                    case MapperMode.SQLITE: return new SQLiteCakeMapper();
                    default: throw new Error(`Unsupported mode ${mode} for Cake`);
                }

            case ItemCategory.BOOK:
                switch (mode) {
                    case MapperMode.CSV:    return new CSVBookMapper();
                    case MapperMode.JSON:   return new JSONBookMapper();
                    case MapperMode.XML:    return new XMLBookMapper();
                    case MapperMode.SQLITE: return new SQLiteBookMapper();
                    default: throw new Error(`Unsupported mode ${mode} for Book`);
                }

            case ItemCategory.TOY:
                switch (mode) {
                    case MapperMode.CSV:    return new CSVToyMapper();
                    case MapperMode.JSON:   return new JSONToyMapper();
                    case MapperMode.XML:    return new XMLToyMapper();
                    case MapperMode.SQLITE: return new SQLiteToyMapper();
                    default: throw new Error(`Unsupported mode ${mode} for Toy`);
                }

            default:
                throw new Error(`Unsupported category ${category}`);
        }
    }
}