import { ID, id } from "../repository/IRepository";

export interface IUser extends ID {
    getName(): string;
    getEmail(): string;
    getPassword(): string;
}

export class User implements IUser {
    private id: id;
    private name: string;
    private email: string;
    private password: string;

    constructor(id: id, name: string, email: string, password: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    getID(): id {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getEmail(): string {
        return this.email;
    }

    getPassword(): string {
        return this.password;
    }

    // Utility method to convert to JSON
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            // Note: password should NOT be included in API responses
        };
    }
}
