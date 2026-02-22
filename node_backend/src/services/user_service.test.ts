// services/user_service.test.ts — Equivalent to go_backend/services/user_service_test.go
import { UserServiceImpl, CreateUserRequest } from './user_service';
import { UserDBOps } from '../dbops/user_dbops';
import { User } from '../entities/user';

/**
 * MockUserDBOps — Equivalent to Go's MockUserDBOps using testify/mock.
 */
class MockUserDBOps implements UserDBOps {
    createFn = jest.fn<Promise<User>, [{ name: string; email: string }]>();
    getByIDFn = jest.fn<Promise<User | null>, [number]>();
    getByEmailFn = jest.fn<Promise<User | null>, [string]>();

    async create(data: { name: string; email: string }): Promise<User> {
        return this.createFn(data);
    }

    async getByID(id: number): Promise<User | null> {
        return this.getByIDFn(id);
    }

    async getByEmail(email: string): Promise<User | null> {
        return this.getByEmailFn(email);
    }
}

describe('UserService', () => {
    let mockDBOps: MockUserDBOps;
    let service: UserServiceImpl;

    beforeEach(() => {
        mockDBOps = new MockUserDBOps();
        service = new UserServiceImpl(mockDBOps);
    });

    describe('createUser', () => {
        it('should create a user successfully', async () => {
            const req: CreateUserRequest = {
                name: 'John Doe',
                email: 'john@example.com',
            };

            const createdUser: User = {
                id: 1,
                name: req.name,
                email: req.email,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };

            mockDBOps.getByEmailFn.mockResolvedValue(null);
            mockDBOps.createFn.mockResolvedValue(createdUser);

            const user = await service.createUser(req);

            expect(user).toBeDefined();
            expect(user.name).toBe(req.name);
            expect(user.email).toBe(req.email);
            expect(mockDBOps.getByEmailFn).toHaveBeenCalledWith(req.email);
            expect(mockDBOps.createFn).toHaveBeenCalledWith({
                name: req.name,
                email: req.email,
            });
        });

        it('should throw error when user already exists', async () => {
            const req: CreateUserRequest = {
                name: 'John Doe',
                email: 'john@example.com',
            };

            const existingUser: User = {
                id: 1,
                name: 'Existing',
                email: req.email,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };

            mockDBOps.getByEmailFn.mockResolvedValue(existingUser);

            await expect(service.createUser(req)).rejects.toThrow('already exists');
            expect(mockDBOps.getByEmailFn).toHaveBeenCalledWith(req.email);
            expect(mockDBOps.createFn).not.toHaveBeenCalled();
        });
    });
});
