import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";


export interface TokenPayload extends JwtPayload {
    userId: string;
}

export interface AuthenticatedRequest extends Request {
    userId: string;
} 