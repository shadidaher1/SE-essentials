import { ItemCategory } from "../Model/IItem";
import { JsonCakeRequestMapper } from "./Cake.mapper";
import { JSONBookMapper } from "./Book.mapper";
import { JsonBookRequestMapper } from "./Book.mapper";
import { JSONToyMapper } from "./Toy.mapper";
import { JsonToyRequestMapper } from "./Toy.mapper";
import { JsonRequestOrderMapper } from "./Order.mapper";
import { JSONCakeMapper } from "./Cake.mapper";

export class JsonRequestFactory {
  public static create(type: ItemCategory): JsonRequestOrderMapper {
    switch (type) {
      case ItemCategory.CAKE:
        return new JsonRequestOrderMapper(new JsonCakeRequestMapper(new JSONCakeMapper()));
      case ItemCategory.BOOK:
        return new JsonRequestOrderMapper(new JsonBookRequestMapper(new JSONBookMapper()));
      case ItemCategory.TOY:
        return new JsonRequestOrderMapper(new JsonToyRequestMapper(new JSONToyMapper()));
      default:
        throw new Error("Unsupported type");
    }
  }
}
