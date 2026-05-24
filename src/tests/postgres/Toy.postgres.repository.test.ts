// src/tests/postgres/Toy.postgres.repository.test.ts

import { PGToyRepository } from "../../repository/postgres/Toy.postgres.repository";
import { ToyBuilder, IdentifiableToyBuilder } from "../../Model/builders/toy.builder";
import { PGConnectionManager } from "../../util/database/PGConnectionManager";
import { DbException } from "../../util/exceptions/repositoryExcpetion";

const buildToy = (id: string) =>
    new IdentifiableToyBuilder()
        .setID(id)
        .setToy(new ToyBuilder()
            .setToyType("Action Figure")
            .setAgeGroup("4-7")
            .setBrand("FunTime")
            .setMaterial("Plastic")
            .setBatteryRequired("No")
            .setEducational("No")
            .setPrice(14.99)
            .setQuantity(2)
            .build())
        .build();

describe("PGToyRepository", () => {
    let repo: PGToyRepository;
    const testId = "test-toy-" + Date.now();

    beforeAll(async () => {
        repo = new PGToyRepository();
        await repo.init();
    });

    afterAll(async () => {
        try { await repo.delete(testId); } catch {}
        await PGConnectionManager.getInstance().closeConnection();
    });

    // ===== CREATE =====
    it("should create a toy", async () => {
        const id = await repo.create(buildToy(testId));
        expect(id).toBe(testId);
    });

    it("should ignore duplicate entry", async () => {
        await expect(repo.create(buildToy(testId))).resolves.not.toThrow();
    });

    // ===== GET =====
    it("should get a toy by id", async () => {
        const toy = await repo.get(testId);
        expect(toy.getID()).toBe(testId);
        expect(toy.getToyType()).toBe("Action Figure");
        expect(toy.getBrand()).toBe("FunTime");
    });

    it("should throw DbException for non-existent toy", async () => {
        await expect(repo.get("non-existent-id")).rejects.toThrow(DbException);
    });

    // ===== GET ALL =====
    it("should get all toys", async () => {
        const toys = await repo.getAll();
        expect(Array.isArray(toys)).toBe(true);
        expect(toys.length).toBeGreaterThan(0);
    });

    // ===== UPDATE =====
    it("should update a toy", async () => {
        const updated = new IdentifiableToyBuilder()
            .setID(testId)
            .setToy(new ToyBuilder()
                .setToyType("Puzzle")         // changed
                .setAgeGroup("8-12")          // changed
                .setBrand("BuildSmart")       // changed
                .setMaterial("Wood")          // changed
                .setBatteryRequired("No")
                .setEducational("Yes")        // changed
                .setPrice(24.99)
                .setQuantity(1)
                .build())
            .build();

        await expect(repo.update(updated)).resolves.not.toThrow();

        const fetched = await repo.get(testId);
        expect(fetched.getToyType()).toBe("Puzzle");
        expect(fetched.getEducational()).toBe("Yes");
    });

    // ===== DELETE =====
    it("should delete a toy", async () => {
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