// routes/routes.ts — Equivalent to go_backend/routes/routes.go
import { Router } from 'express';
import { UserController } from '../controllers/user_controller';

/**
 * Register all application routes.
 * Mirrors the Go RegisterRoutes function.
 */
export function registerRoutes(userController: UserController): Router {
    const router = Router();

    // /api/users
    const usersRouter = Router();
    usersRouter.post('/', userController.createUser);
    usersRouter.get('/:id', userController.getUser);

    router.use('/users', usersRouter);

    return router;
}
