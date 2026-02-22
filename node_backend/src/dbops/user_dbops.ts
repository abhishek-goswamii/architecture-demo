// dbops/user_dbops.ts — Equivalent to go_backend/dbops/user_dbops.go
import { PrismaClient } from '@prisma/client';
import { User } from '../entities/user';

/**
 * Interface for User database operations.
 * Mirrors the Go UserDBOps interface for dependency injection.
 */
export interface UserDBOps {
    create(data: { name: string; email: string }): Promise<User>;
    getByID(id: number): Promise<User | null>;
    getByEmail(email: string): Promise<User | null>;
}

/**
 * Prisma-based implementation of UserDBOps.
 * Equivalent to the Go userDBOps struct.
 */
export class PrismaUserDBOps implements UserDBOps {
    private db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    async create(data: { name: string; email: string }): Promise<User> {
        return this.db.user.create({
            data: {
                name: data.name,
                email: data.email,
            },
        });
    }

    async getByID(id: number): Promise<User | null> {
        return this.db.user.findFirst({
            where: {
                id,
                deletedAt: null, // Soft delete filter
            },
        });
    }

    async getByEmail(email: string): Promise<User | null> {
        return this.db.user.findFirst({
            where: {
                email,
                deletedAt: null, // Soft delete filter
            },
        });
    }
}
