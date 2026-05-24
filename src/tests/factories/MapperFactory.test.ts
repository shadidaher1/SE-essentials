// src/tests/factories/MapperFactory.test.ts

import { MapperFactory, MapperMode } from "../../mappers/Mapper.factory";
import { ItemCategory } from "../../Model/IItem";
import { CSVCakeMapper, JSONCakeMapper, XMLCakeMapper, SQLiteCakeMapper } from "../../mappers/Cake.mapper";
import { CSVBookMapper, JSONBookMapper, XMLBookMapper, SQLiteBookMapper } from "../../mappers/Book.mapper";
import { CSVToyMapper, JSONToyMapper, XMLToyMapper, SQLiteToyMapper } from "../../mappers/Toy.mapper";

describe("MapperFactory", () => {

    // ===== CAKE =====
    it("should create CSVCakeMapper", () => {
        const mapper = MapperFactory.create(MapperMode.CSV, ItemCategory.CAKE);
        expect(mapper).toBeInstanceOf(CSVCakeMapper);
    });

    it("should create JSONCakeMapper", () => {
        const mapper = MapperFactory.create(MapperMode.JSON, ItemCategory.CAKE);
        expect(mapper).toBeInstanceOf(JSONCakeMapper);
    });

    it("should create XMLCakeMapper", () => {
        const mapper = MapperFactory.create(MapperMode.XML, ItemCategory.CAKE);
        expect(mapper).toBeInstanceOf(XMLCakeMapper);
    });

    it("should create SQLiteCakeMapper", () => {
        const mapper = MapperFactory.create(MapperMode.SQLITE, ItemCategory.CAKE);
        expect(mapper).toBeInstanceOf(SQLiteCakeMapper);
    });

    // ===== BOOK =====
    it("should create CSVBookMapper", () => {
        const mapper = MapperFactory.create(MapperMode.CSV, ItemCategory.BOOK);
        expect(mapper).toBeInstanceOf(CSVBookMapper);
    });

    it("should create JSONBookMapper", () => {
        const mapper = MapperFactory.create(MapperMode.JSON, ItemCategory.BOOK);
        expect(mapper).toBeInstanceOf(JSONBookMapper);
    });

    it("should create XMLBookMapper", () => {
        const mapper = MapperFactory.create(MapperMode.XML, ItemCategory.BOOK);
        expect(mapper).toBeInstanceOf(XMLBookMapper);
    });

    it("should create SQLiteBookMapper", () => {
        const mapper = MapperFactory.create(MapperMode.SQLITE, ItemCategory.BOOK);
        expect(mapper).toBeInstanceOf(SQLiteBookMapper);
    });

    // ===== TOY =====
    it("should create CSVToyMapper", () => {
        const mapper = MapperFactory.create(MapperMode.CSV, ItemCategory.TOY);
        expect(mapper).toBeInstanceOf(CSVToyMapper);
    });

    it("should create JSONToyMapper", () => {
        const mapper = MapperFactory.create(MapperMode.JSON, ItemCategory.TOY);
        expect(mapper).toBeInstanceOf(JSONToyMapper);
    });

    it("should create XMLToyMapper", () => {
        const mapper = MapperFactory.create(MapperMode.XML, ItemCategory.TOY);
        expect(mapper).toBeInstanceOf(XMLToyMapper);
    });

    it("should create SQLiteToyMapper", () => {
        const mapper = MapperFactory.create(MapperMode.SQLITE, ItemCategory.TOY);
        expect(mapper).toBeInstanceOf(SQLiteToyMapper);
    });

    // ===== EDGE CASES =====
    it("should throw for unsupported category", () => {
        expect(() =>
            MapperFactory.create(MapperMode.CSV, "unsupported" as ItemCategory)
        ).toThrow("Unsupported category");
    });

    it("should throw for unsupported mode", () => {
        expect(() =>
            MapperFactory.create("unsupported" as MapperMode, ItemCategory.CAKE)
        ).toThrow("Unsupported mode");
    });
});