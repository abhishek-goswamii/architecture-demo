// controllers/user_controller.ts — Equivalent to go_backend/controllers/user_controller.go
import { Request, Response } from 'express';
import { UserService, CreateUserRequest } from '../services/user_service';
import * as apiResponse from '../utils/response';

/**
 * UserController — handles HTTP requests for user operations.
 * Mirrors the Go UserController struct with dependency injection.
 */
export class UserController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    /**
     * POST /api/users — Create a new user.
     */
    createUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, email } = req.body as CreateUserRequest;

            if (!name || !email) {
                apiResponse.error(res, 400, 'Name and email are required');
                return;
            }

            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                apiResponse.error(res, 400, 'Invalid email format');
                return;
            }

            const user = await this.userService.createUser({ name, email });
            apiResponse.success(res, 201, 'User created successfully', user);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Internal Server Error';
            apiResponse.error(res, 500, message);
        }
    };

    /**
     * GET /api/users/:id — Get a user by ID.
     */
    getUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                apiResponse.error(res, 400, 'Invalid user ID');
                return;
            }

            const user = await this.userService.getUser(id);
            apiResponse.success(res, 200, 'User retrieved successfully', user);
        } catch (err) {
            apiResponse.error(res, 404, 'User not found');
        }
    };
}
