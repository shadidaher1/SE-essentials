import { Request, Response } from 'express';
import { AuthenticationService } from '../services/Authentication.service';
import { BadRequestException } from '../util/exceptions/http/BadRequestException';
import { UserRepository } from '../repository/sqlite/User.repository';
import { UserService } from '../services/User.service';
import { AuthenticatedRequest } from '../config/types';

export class AuthController {
    constructor(private authService: AuthenticationService, private userService: UserService) {}
    
    async login(req: Request, res: Response): Promise<void> {
        const {email, password} = req.body;
        if (!email || !password) {
            throw new BadRequestException('Email and password are required', {
                emailRequired: !email,
                passwordRequired: !password
            });
        }

        // validate user credentials
        try {
        const userId = await this.userService.validateUser(email, password);
        this.authService.persistAuthentication(res, userId );
        
        res.status(200).json({
            status: 'Login success',
        });
        } catch (error) {
            throw new BadRequestException('Invalid email or password');
        }
    }
    logout(req: Request, res: Response): void {
        const authReq = req as AuthenticatedRequest;
        this.authService.clear(res);
        res.status(200).json({
            status: 'Logout success',
        });
    }
}

