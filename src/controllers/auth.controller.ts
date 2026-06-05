import { Request, Response } from 'express';
import { AuthenticationService } from '../services/Authentication.service';
import { BadRequestException } from '../util/exceptions/http/BadRequestException';
import { UserService } from '../services/User.service';
import { Userpayload } from '../config/types';
import { toRole } from '../config/roles';

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
        const user = await this.userService.validateUser(email, password);
        const userPayload: Userpayload = {
            userId: user.getID(),
            role: toRole(user.getRole())
        }
    this.authService.persistAuthentication(res,  userPayload);
        
        res.status(200).json({
            status: 'Login success',
        });
        } catch (_error) {
            throw new BadRequestException('Invalid email or password');
        }
    }
    logout(req: Request, res: Response): void {
        this.authService.clear(res);
        res.status(200).json({
            status: 'Logout success',
        });
    }
}

