// services/user_service.ts — Equivalent to go_backend/services/user_service.go
import { UserDBOps } from '../dbops/user_dbops';
import { User } from '../entities/user';

/**
 * Request DTO for creating a user.
 * Mirrors Go's CreateUserRequest struct.
 */
export interface CreateUserRequest {
    name: string;
    email: string;
}

/**
 * Interface for User service operations.
 * Mirrors the Go UserService interface for dependency injection.
 */
export interface UserService {
    createUser(req: CreateUserRequest): Promise<User>;
    getUser(id: number): Promise<User>;
}

/**
 * Implementation of User service with business logic.
 * Equivalent to the Go userService struct.
 */
export class UserServiceImpl implements UserService {
    private userDBOps: UserDBOps;

    constructor(userDBOps: UserDBOps) {
        this.userDBOps = userDBOps;
    }

    async createUser(req: CreateUserRequest): Promise<User> {
        // Business logic: check if email already exists
        const existingUser = await this.userDBOps.getByEmail(req.email);
        if (existingUser) {
            throw new Error(`User with email ${req.email} already exists`);
        }

        const user = await this.userDBOps.create({
            name: req.name,
            email: req.email,
        });

        return user;
    }

    async getUser(id: number): Promise<User> {
        const user = await this.userDBOps.getByID(id);
        if (!user) {
            throw new Error(`Failed to get user: user not found`);
        }
        return user;
    }
}
