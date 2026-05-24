// src/tests/postgres/Book.postgres.repository.test.ts

import { PGBookRepository } from "../../repository/postgres/Book.postgres.repository";
import { BookBuilder, IdetifiableBookBuilder } from "../../Model/builders/book.builder";
import { PGConnectionManager } from "../../util/database/PGConnectionManager";
import { DbException } from "../../util/exceptions/repositoryExcpetion";

const buildBook = (id: string) =>
    new IdetifiableBookBuilder()
        .setId(id)
        .setBook(new BookBuilder()
            .setBookTitle("Clean Code")
            .setAuthor("Robert Martin")
            .setGenre("Non-Fiction")
            .setFormat("Hardcover")
            .setLanguage("English")
            .setPublisher("Penguin Random House")
            .setSpecialEdition("None")
            .setPackaging("Standard Wrap")
            .setPrice(29.99)
            .setQuantity(1)
            .build())
        .build();

describe("PGBookRepository", () => {
    let repo: PGBookRepository;
    const testId = "test-book-" + Date.now();

    beforeAll(async () => {
        repo = new PGBookRepository();
        await repo.init();
    });

    afterAll(async () => {
        try { await repo.delete(testId); } catch {}
        await PGConnectionManager.getInstance().closeConnection();
    });

    // ===== CREATE =====
    it("should create a book", async () => {
        const id = await repo.create(buildBook(testId));
        expect(id).toBe(testId);
    });

    it("should ignore duplicate entry", async () => {
        await expect(repo.create(buildBook(testId))).resolves.not.toThrow();
    });

    // ===== GET =====
    it("should get a book by id", async () => {
        const book = await repo.get(testId);
        expect(book.getID()).toBe(testId);
        expect(book.getBookTitle()).toBe("Clean Code");
        expect(book.getAuthor()).toBe("Robert Martin");
    });

    it("should throw DbException for non-existent book", async () => {
        await expect(repo.get("non-existent-id")).rejects.toThrow(DbException);
    });

    // ===== GET ALL =====
    it("should get all books", async () => {
        const books = await repo.getAll();
        expect(Array.isArray(books)).toBe(true);
        expect(books.length).toBeGreaterThan(0);
    });

    // ===== UPDATE =====
    it("should update a book", async () => {
        const updated = new IdetifiableBookBuilder()
            .setId(testId)
            .setBook(new BookBuilder()
                .setBookTitle("The Pragmatic Programmer")  // changed
                .setAuthor("Andrew Hunt")                  // changed
                .setGenre("Non-Fiction")
                .setFormat("Paperback")
                .setLanguage("English")
                .setPublisher("Penguin Random House")
                .setSpecialEdition("None")
                .setPackaging("Standard Wrap")
                .setPrice(35.00)
                .setQuantity(2)
                .build())
            .build();

        await expect(repo.update(updated)).resolves.not.toThrow();

        const fetched = await repo.get(testId);
        expect(fetched.getBookTitle()).toBe("The Pragmatic Programmer");
        expect(fetched.getAuthor()).toBe("Andrew Hunt");
    });

    // ===== DELETE =====
    it("should delete a book", async () => {
        await expect(repo.delete(testId)).resolves.not.toThrow();
    });

    it("should throw after delete", async () => {
        await expect(repo.get(testId)).rejects.toThrow(DbException);
    });

    // ===== EDGE CASES =====
    it("should handle deleting non-existent id without throwing", async () => {
        await expect(repo.delete("non-existent-id")).resolves.not.toThrow();
    });
});