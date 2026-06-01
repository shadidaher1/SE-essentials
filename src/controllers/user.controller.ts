import { Request, Response } from "express";
import { UserService, CreateUserDTO, UpdateUserDTO } from "../services/User.service";
import { BadRequestException } from "../util/exceptions/http/BadRequestException";

export class UserController {
    constructor(private readonly userService: UserService) {}

    /**
     * Create a new user
     * POST /users
     */
    public async createUser(req: Request, res: Response): Promise<void> {
        const userData: CreateUserDTO = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        };

        // Validate required fields
        if (!userData.name || !userData.email || !userData.password) {
            throw new BadRequestException("Missing required fields: name, email, password", {
                missingFields: true
            });
        }

        const newUser = await this.userService.createUser(userData);

        res.status(201).json({
            status: "success",
            data: newUser.toJSON()
        });
    }

    /**
     * Get a user by ID
     * GET /users/:id
     */
    public async getUserById(req: Request, res: Response): Promise<void> {
        const rawUserId = req.params.id;
        const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;

        if (!userId) {
            throw new BadRequestException("User ID is required", {
                idNotDefined: true
            });
        }

        const user = await this.userService.getUserById(userId);

        res.status(200).json({
            status: "success",
            data: user.toJSON()
        });
    }

    /**
     * Get a user by email
     * GET /users/email/:email
     */
    public async getUserByEmail(req: Request, res: Response): Promise<void> {
        const rawEmail = req.params.email;
        const email = Array.isArray(rawEmail) ? rawEmail[0] : rawEmail;

        if (!email) {
            throw new BadRequestException("Email is required", {
                emailNotDefined: true
            });
        }

        const user = await this.userService.getUserByEmail(email);

        res.status(200).json({
            status: "success",
            data: user.toJSON()
        });
    }

    /**
     * Get all users
     * GET /users
     */
    public async getAllUsers(req: Request, res: Response): Promise<void> {
        const users = await this.userService.getAllUsers();

        res.status(200).json({
            status: "success",
            data: users.map(user => user.toJSON()),
            count: users.length
        });
    }

    /**
     * Update a user
     * PUT /users/:id
     */
    public async updateUser(req: Request, res: Response): Promise<void> {
        const rawUserId = req.params.id;
        const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;

        if (!userId) {
            throw new BadRequestException("User ID is required", {
                idNotDefined: true
            });
        }

        const updateData: UpdateUserDTO = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        };

        // Remove undefined fields
        Object.keys(updateData).forEach(key => {
            if (updateData[key as keyof UpdateUserDTO] === undefined) {
                delete updateData[key as keyof UpdateUserDTO];
            }
        });

        if (Object.keys(updateData).length === 0) {
            throw new BadRequestException("No fields to update", {
                noFieldsToUpdate: true
            });
        }

        const updatedUser = await this.userService.updateUser(userId, updateData);

        res.status(200).json({
            status: "success",
            data: updatedUser.toJSON()
        });
    }

    /**
     * Delete a user
     * DELETE /users/:id
     */
    public async deleteUser(req: Request, res: Response): Promise<void> {
        const rawUserId = req.params.id;
        const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;

        if (!userId) {
            throw new BadRequestException("User ID is required", {
                idNotDefined: true
            });
        }

        await this.userService.deleteUser(userId);

        res.status(200).json({
            status: "success",
            message: `User ${userId} has been deleted`
        });
    }
}
