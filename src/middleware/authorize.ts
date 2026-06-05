import { Request, Response, NextFunction } from "express";
import { Permission, ROLE, rolePermission } from "../config/roles";
import { AuthenticatedRequest } from "../config/types";
import { AuthenticationException } from "../util/exceptions/http/AuthenticationException";
import { InsufficientPermissionsException, InvalidRoleException } from "../util/exceptions/http/AuthorizationException";
import logger from "../util/logger";

export function hasPermission(permission: Permission){
    return (req: Request, res: Response, next: NextFunction) => {
        const authReq = req as AuthenticatedRequest;
        if (!authReq.user) {
            throw new AuthenticationException("User not authenticated");
        }
        const userRole = authReq.user.role;
        if(!rolePermission[userRole]) {
            throw new InvalidRoleException(userRole);
        }
        if(!rolePermission[userRole].includes(permission)) {
            logger.error(`User with role ${userRole} does not have permission ${permission}`);
            throw new InsufficientPermissionsException(userRole);
        }
        next();
    }
}

export function hasRole(allowedRoles: ROLE[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const authReq = req as AuthenticatedRequest;
        if (!authReq.user) {
            throw new AuthenticationException("User not authenticated");
        }
        if (!allowedRoles.includes(authReq.user.role)) {
            logger.error(`User with role ${authReq.user.role} does not have required role ${allowedRoles}`);
            throw new InsufficientPermissionsException(authReq.user.role);
        }
        next();
    }
}