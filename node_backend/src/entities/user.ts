// entities/user.ts — Equivalent to go_backend/entities/user.go
// Type definitions that mirror the Prisma schema.
// These are the application-level types used across layers.

export interface User {
    id: number;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
