import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { ROLE } from "./roles";


export interface Userpayload {
    userId: string;
    role: ROLE;
}


export interface TokenPayload extends JwtPayload, Userpayload {
   user: Userpayload;
}


export interface AuthenticatedRequest extends Request {
    user: Userpayload;
} 