// src/tests/factories/RepositoryFactory.test.ts

import { RepositoryFactory, DBMode } from "../../repository/Repository.factory";
import { ItemCategory } from "../../Model/IItem";
import { OrderRepository } from "../../repository/sqlite/Order.Repository";
import { PGOrderRepository } from "../../repository/postgres/Order.postgres.repository";
import { BookRepository } from "../../repository/sqlite/Book.order.repository";
import { ToyRepository } from "../../repository/sqlite/Toy.order.repository";
import { PGBookRepository } from "../../repository/postgres/Book.postgres.repository";
import { PGToyRepository } from "../../repository/postgres/Toy.postgres.repository";
import { PGConnectionManager } from "../../util/database/PGConnectionManager";

describe("RepositoryFactory", () => {

    afterAll(async () => {
        await PGConnectionManager.getInstance().closeConnection();
    });

    // ===== SQLITE =====
    it("should create SQLite Cake OrderRepository", async () => {
        const repo = await RepositoryFactory.create(DBMode.SQLITE, ItemCategory.CAKE);
        expect(repo).toBeInstanceOf(OrderRepository);
    });

    it("should create SQLite Book Repository", async () => {
        const repo = await RepositoryFactory.createItemRepository(DBMode.SQLITE, ItemCategory.BOOK);
        expect(repo).toBeInstanceOf(BookRepository);
    });

    it("should create SQLite Toy Repository", async () => {
        const repo = await RepositoryFactory.createItemRepository(DBMode.SQLITE, ItemCategory.TOY);
        expect(repo).toBeInstanceOf(ToyRepository);
    });

    // ===== POSTGRES =====
    it("should create PostgreSQL Cake OrderRepository", async () => {
        const repo = await RepositoryFactory.create(DBMode.POSTGRES, ItemCategory.CAKE);
        expect(repo).toBeInstanceOf(PGOrderRepository);
    });

    it("should create PostgreSQL Book Repository", async () => {
        const repo = await RepositoryFactory.createItemRepository(DBMode.POSTGRES, ItemCategory.BOOK);
        expect(repo).toBeInstanceOf(PGBookRepository);
    });

    it("should create PostgreSQL Toy Repository", async () => {
        const repo = await RepositoryFactory.createItemRepository(DBMode.POSTGRES, ItemCategory.TOY);
        expect(repo).toBeInstanceOf(PGToyRepository);
    });

    // ===== EDGE CASES =====
    it("should throw for unsupported category in SQLITE", async () => {
        await expect(
            RepositoryFactory.create(DBMode.SQLITE, "unsupported" as ItemCategory)
        ).rejects.toThrow("Unsupported category");
    });

    it("should throw for unsupported category in POSTGRES", async () => {
        await expect(
            RepositoryFactory.create(DBMode.POSTGRES, "unsupported" as ItemCategory)
        ).rejects.toThrow("Unsupported category");
    });

    it("should throw for unsupported DB mode", async () => {
        await expect(
            RepositoryFactory.create("unsupported" as DBMode, ItemCategory.CAKE)
        ).rejects.toThrow("Unsupported DB mode");
    });
});