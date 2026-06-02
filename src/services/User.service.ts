import { User } from "../Model/User.Model";
import { UserRepository } from "../repository/sqlite/User.repository";
import { generateUUID } from "../util";
import { ServiceException } from "../util/exceptions/ServiceException";
import { NotFoundException } from "../util/exceptions/http/NotFoundException";
import { BadRequestException } from "../util/exceptions/http/BadRequestException";
import logger from "../util/logger";
import { id } from "../repository/IRepository";

export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}

export interface UpdateUserDTO {
    name?: string;
    email?: string;
    password?: string;
}

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    /**
     * Initialize the user service by setting up the database table
     */
    public async init(): Promise<void> {
        await this.userRepository.init();
    }

    /**
     * Create a new user
     * @param userData The user data to create
     * @returns The created user
     */
    public async createUser(userData: CreateUserDTO): Promise<User> {
        try {
            this.validateUserData(userData);

            // Check if user with email already exists
            try {
                await this.userRepository.getByEmail(userData.email);
                throw new BadRequestException("User with this email already exists", {
                    emailExists: true
                });
            } catch (error: unknown) {
                if (error instanceof BadRequestException) {
                    throw error;
                }
                // Email doesn't exist, proceed
            }

            const userId = generateUUID();
            const user = new User(userId, userData.name, userData.email, userData.password);
            
            await this.userRepository.create(user);
            logger.info(`User created: ${userId}`);
            
            return user;
        } catch (error: unknown) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            logger.error("Failed to create user", error as Error);
            throw new ServiceException("Failed to create user");
        }
    }

    /**
     * Get a user by ID
     * @param userId The user ID
     * @returns The user
     */
    public async getUserById(userId: string): Promise<User> {
        try {
            if (!userId) {
                throw new BadRequestException("User ID is required", {
                    idNotDefined: true
                });
            }

            const user = await this.userRepository.get(userId);
            return user;
        } catch (error: unknown) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            logger.error(`Failed to get user ${userId}`, error as Error);
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
    }

    /**
     * Get a user by email
     * @param email The user email
     * @returns The user
     */
    public async getUserByEmail(email: string): Promise<User> {
        try {
            if (!email) {
                throw new BadRequestException("Email is required", {
                    emailNotDefined: true
                });
            }

            const user = await this.userRepository.getByEmail(email);
            return user;
        } catch (error: unknown) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            logger.error(`Failed to get user with email ${email}`, error as Error);
            throw new NotFoundException(`User with email ${email} not found`);
        }
    }

    /**
     * Get all users
     * @returns Array of all users
     */
    public async getAllUsers(): Promise<User[]> {
        try {
            const users = await this.userRepository.getAll();
            return users;
        } catch (error: unknown) {
            logger.error("Failed to get all users", error as Error);
            throw new ServiceException("Failed to get all users");
        }
    }

    /**
     * Update a user
     * @param userId The user ID
     * @param updateData The data to update
     * @returns The updated user
     */
    public async updateUser(userId: string, updateData: UpdateUserDTO): Promise<User> {
        try {
            if (!userId) {
                throw new BadRequestException("User ID is required", {
                    idNotDefined: true
                });
            }

            // Get existing user
            const existingUser = await this.userRepository.get(userId);

            // Validate update data
            if (updateData.email && updateData.email !== existingUser.getEmail()) {
                try {
                    await this.userRepository.getByEmail(updateData.email);
                    throw new BadRequestException("User with this email already exists", {
                        emailExists: true
                    });
                } catch (error: unknown) {
                    if (error instanceof BadRequestException) {
                        throw error;
                    }
                    // Email doesn't exist, proceed
                }
            }

            const updatedUser = new User(
                userId,
                updateData.name ?? existingUser.getName(),
                updateData.email ?? existingUser.getEmail(),
                updateData.password ?? existingUser.getPassword()
            );

            await this.userRepository.update(updatedUser);
            logger.info(`User updated: ${userId}`);

            return updatedUser;
        } catch (error: unknown) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            logger.error(`Failed to update user ${userId}`, error as Error);
            throw new ServiceException(`Failed to update user ${userId}`);
        }
    }

    /**
     * Delete a user
     * @param userId The user ID
     */
    public async deleteUser(userId: string): Promise<void> {
        try {
            if (!userId) {
                throw new BadRequestException("User ID is required", {
                    idNotDefined: true
                });
            }

            await this.userRepository.delete(userId);
            logger.info(`User deleted: ${userId}`);
        } catch (error: unknown) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            logger.error(`Failed to delete user ${userId}`, error as Error);
            throw new ServiceException(`Failed to delete user ${userId}`);
        }
    }

    /**
     * Validate user data
     * @param userData The user data to validate
     */
    private validateUserData(userData: CreateUserDTO): void {
        if (!userData.name || userData.name.trim().length === 0) {
            throw new BadRequestException("Name is required", {
                nameRequired: true
            });
        }

        if (!userData.email || userData.email.trim().length === 0) {
            throw new BadRequestException("Email is required", {
                emailRequired: true
            });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            throw new BadRequestException("Invalid email format", {
                invalidEmailFormat: true
            });
        }

        if (!userData.password || userData.password.length < 6) {
            throw new BadRequestException("Password must be at least 6 characters long", {
                passwordTooShort: true
            });
        }
    }
    async validateUser(email: string, password: string): Promise<id> {
        try {
            const user = await this.getUserByEmail(email);
            if (!user) {
                throw new NotFoundException("User not found", {
                    userNotFound: true
                });
            }
            if (user.getPassword() !== password) {
                throw new BadRequestException("Invalid email or password", {
                    invalidCredentials: true
                });
            }
            return user.getID();
        }
        catch (error: unknown) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            logger.error(`Failed to validate user with email ${email}`, error as Error);
            throw new ServiceException("Failed to validate user");
        }
    
}
}