import jwt from 'jsonwebtoken';
import config from "../config";
import { TokenPayload, Userpayload } from '../config/types';
import { AuthenticationException, InvalidTokenException, TokenExpiredException } from '../util/exceptions/http/AuthenticationException';
import logger from '../util/logger';
import { ServiceException } from '../util/exceptions/ServiceException';
// import { id } from '../repository/IRepository';
// import { id } from '../repository/IRepository';
import ms from 'ms';
import { Response } from 'express';


export class AuthenticationService {

    // private secretKey: string;
    // private tokenExpiration: string;

    constructor(private secretKey = config.auth.secretKey,
                private tokenExpiration = config.auth.tokenExpiration,
                private refreshTokenExpiration = config.auth.refreshTokenExpiration
            ) {}

    generateToken(payload: Userpayload): string {
        return jwt.sign(payload, 
            this.secretKey,
             { expiresIn: this.tokenExpiration });
    }
    generateRefreshToken(payload: Userpayload): string {
        return jwt.sign(payload, 
            this.secretKey, { expiresIn: config.auth.refreshTokenExpiration });
    }
    verifyToken(token: string): Userpayload{
        try {           
             return jwt.verify(token, this.secretKey) as Userpayload;
        } catch (error) {
            logger.error('Token verification failed', { error });
            if (error instanceof jwt.TokenExpiredError) {
                throw new TokenExpiredException();
            } else if (error instanceof jwt.JsonWebTokenError) {
                throw new InvalidTokenException();
            }
            throw new ServiceException("Token verification failed");
        }
    }
    setTokenIntoCookie(res: any, token: string): void {
        res.cookie('token', token, {
            httpOnly: true,
            secure: !config.isDev,
            maxAge: ms(this.tokenExpiration)
        });
    }
    setRefreshTokenIntoCookie(res: any, refreshToken: string): void {
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: !config.isDev,
            maxAge: ms(this.refreshTokenExpiration)
        });
    }
    clear(res: Response): void {
        res.clearCookie('token');
        res.clearCookie('refreshToken');
    }
    persistAuthentication(res: Response, payload: Userpayload): void {
        const token = this.generateToken(payload);
        const refreshToken = this.generateRefreshToken(payload);
        this.setTokenIntoCookie(res, token);
        this.setRefreshTokenIntoCookie(res, refreshToken);

    }
    refreshToken(refreshToken: string): string {
        try {
            const payload = this.verifyToken(refreshToken);
            if(!payload) {
                throw new AuthenticationException("Invalid refresh token");
            }
            const newToken = this.generateToken(payload);
            return newToken;
        } catch (error) {
            logger.error('Refresh token verification failed', { error });
            throw new AuthenticationException("Invalid refresh token");
        }
    }
}