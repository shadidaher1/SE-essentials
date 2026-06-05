import { Request, Response, NextFunction } from 'express';
import { AuthenticationException, MissingTokenException } from '../util/exceptions/http/AuthenticationException';
import { AuthenticationService } from '../services/Authentication.service';
import { AuthenticatedRequest } from '../config/types';



const authService =  new AuthenticationService(); // implement this service to handle token verification and other auth-related logic
export function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
        let token = req.cookies.token;
        const refreshToken = req.cookies.refreshToken;
         if (!token) {
            if (!refreshToken) {
                throw new AuthenticationException("Missing token");
            }
            const newToken = authService.refreshToken(refreshToken);
            authService.setTokenIntoCookie(res, newToken);
            
            token = newToken;
        }
        const payload = authService.verifyToken(token);
        (req as AuthenticatedRequest).user = payload;
        next();
    } catch (error) {
        next(error);
    }
}