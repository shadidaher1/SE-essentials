

export interface IInitializable {
    /**
     * Initializes the object.
     *
     * @returns A promise that resolves when the initialization is complete.
     * @throws {InitializationException} If the initialization fails.
     */
    init(): Promise<void>;
}


/**
 * Represents an object with a unique identifier.
 */
export type id = string;
export interface ID {
    /**
     * Get the unique identifier for this object.
     * @returns The unique identifier string.
     */
    getID(): id;
}

/**
 * Generic repository interface for CRUD operations.
 * @template T - The item type stored in the repository.
 */
export interface IRepository<T extends ID> {
    /**
     * Create a new item in the repository.
     * @param item - The item to create.
     * @returns A promise that resolves to the ID of the created item.
     * @throws {Error} When the provided item is invalid.
     */
    create(item: T): Promise<id>;

    /**
     * Retrieve an item from the repository by its ID.
     * @param id - The ID of the item to retrieve.
     * @returns A promise that resolves to the requested item or null if not found.
     * @throws {Error} When the ID is invalid.
     */
    get(id: id): Promise<T>;

    /**
     * Retrieve all items from the repository.
     * @returns A promise that resolves to an array of all repository items.
     */
    getAll(): Promise<T[]>;

    /**
     * Update an existing item in the repository.
     * @param item - The item to update.
     * @returns A promise that resolves when the update is complete.
     * @throws {Error} When the item is invalid or not found.
     */
    update(item: T): Promise<void>;

    /**
     * Delete an item from the repository by its ID.
     * @param id - The ID of the item to delete.
     * @returns A promise that resolves when the item has been deleted.
     * @throws {Error} When the item is not found.
     */
    delete(id: id): Promise<void>;
}

