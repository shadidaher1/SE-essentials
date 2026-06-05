import { HttpException } from "./HttpException";



export class AuthorizationException extends HttpException {
    constructor(message: string) {
        super(403, message);
        this.name = "AuthorizationException";
    }
    }


export class InvalidRoleException extends AuthorizationException {
    constructor(role: string) {
        super(`Invalid role: ${role}`);
        this.name = "InvalidRoleException";
    }
}
export class InsufficientPermissionsException extends AuthorizationException {
    constructor(role: string) {
        super(`User with role ${role} does not have sufficient permissions`);
        this.name = "InsufficientPermissionsException";
    }
}