
export class ItemNotFoundException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ItemNotFoundException";
    }
}

export class InvalidItemException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidItemException";
    }
}

export class OrderNotFoundException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "OrderNotFoundException";
    }
}

export class OrderCreationException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "OrderCreationException";
    }
}
export class InitializationException extends Error {
    constructor(message: string, error: Error) {
        super(message);
        this.name = "InitializationException";
        this.message = message;
        this.stack = error.stack;
    }
}
export class DbException extends Error {
    constructor(message: string, error: Error) {
        super(message);
        this.name = "DbException";
        this.message = message;
        this.stack = error.stack;
    }
}

