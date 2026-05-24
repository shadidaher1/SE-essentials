// src/tests/postgres/Cake.postgres.repository.test.ts

import { PGCakeRepository } from "../../repository/postgres/Cake.postgres.repository";
import { CakeBuilder, IdetifiableCakeBuilder } from "../../Model/builders/cake.builder";
import { PGConnectionManager } from "../../util/database/PGConnectionManager";
import { DbException } from "../../util/exceptions/repositoryExcpetion";

const buildCake = (id: string) => {
    const cake = new CakeBuilder()
        .setCakeType("Chocolate")
        .setFlavor("Vanilla")
        .setFilling("Cream")
        .setSize(10)
        .setLayers(2)
        .setFrostingType("Buttercream")
        .setFrostingFlavor("Vanilla")
        .setDecorationType("Sprinkles")
        .setDecorationColor("Red")
        .setCustomMessage("Happy Birthday")
        .setShape("Round")
        .setAllergies("None")
        .setSpecialIngredients("None")
        .setPackagingType("Standard Box")
        .build();
    return new IdetifiableCakeBuilder().setId(id).setCake(cake).build();
};

describe("PGCakeRepository", () => {
    let repo: PGCakeRepository;
    const testId = "test-cake-" + Date.now();

    beforeAll(async () => {
        repo = new PGCakeRepository();
        await repo.init();
    });

    afterAll(async () => {
        // cleanup test data
        try { await repo.delete(testId); } catch {}
        await PGConnectionManager.getInstance().closeConnection();
    });

    // ===== CREATE =====
    it("should create a cake", async () => {
        const cake = buildCake(testId);
        const id = await repo.create(cake);
        expect(id).toBe(testId);
    });

    it("should ignore duplicate entry (ON CONFLICT DO NOTHING)", async () => {
        const cake = buildCake(testId);
        await expect(repo.create(cake)).resolves.not.toThrow();
    });

    // ===== GET =====
    it("should get a cake by id", async () => {
        const cake = await repo.get(testId);
        expect(cake.getID()).toBe(testId);
        expect(cake.getCakeType()).toBe("Chocolate");
        expect(cake.getFlavor()).toBe("Vanilla");
    });

    it("should throw DbException when getting non-existent cake", async () => {
        await expect(repo.get("non-existent-id")).rejects.toThrow(DbException);
    });

    // ===== GET ALL =====
    it("should get all cakes", async () => {
        const cakes = await repo.getAll();
        expect(Array.isArray(cakes)).toBe(true);
        expect(cakes.length).toBeGreaterThan(0);
    });

    // ===== UPDATE =====
    it("should update a cake", async () => {
        const updatedCake = new IdetifiableCakeBuilder()
            .setId(testId)
            .setCake(new CakeBuilder()
                .setCakeType("Sponge")       // changed
                .setFlavor("Chocolate")      // changed
                .setFilling("Ganache")       // changed
                .setSize(12)
                .setLayers(3)
                .setFrostingType("Fondant")
                .setFrostingFlavor("Chocolate")
                .setDecorationType("Flowers")
                .setDecorationColor("Pink")
                .setCustomMessage("Congrats")
                .setShape("Square")
                .setAllergies("Nut-Free")
                .setSpecialIngredients("None")
                .setPackagingType("Luxury Box with Ribbon")
                .build())
            .build();

        await expect(repo.update(updatedCake)).resolves.not.toThrow();

        const fetched = await repo.get(testId);
        expect(fetched.getCakeType()).toBe("Sponge");
        expect(fetched.getFlavor()).toBe("Chocolate");
    });

    // ===== DELETE =====
    it("should delete a cake", async () => {
        await expect(repo.delete(testId)).resolves.not.toThrow();
    });

    it("should return empty after delete", async () => {
        await expect(repo.get(testId)).rejects.toThrow(DbException);
    });

    // ===== EDGE CASES =====
    it("should handle deleting non-existent id without throwing", async () => {
        await expect(repo.delete("non-existent-id")).resolves.not.toThrow();
    });
});