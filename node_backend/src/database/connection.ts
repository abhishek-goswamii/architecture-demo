// database/connection.ts — Equivalent to go_backend/database/connection.go
import { PrismaClient } from '@prisma/client';
import { Config } from '../config/config';
import logger from '../logger/logger';

let prisma: PrismaClient;

/**
 * Initialize and return the Prisma database client.
 * Mirrors the Go InitDB function with connection pooling configured via DATABASE_URL params.
 */
export function initDB(cfg: Config): PrismaClient {
    try {
        prisma = new PrismaClient({
            datasourceUrl: cfg.databaseUrl,
            log:
                cfg.environment === 'development'
                    ? ['query', 'info', 'warn', 'error']
                    : ['error'],
        });

        logger.info('Database connection established');
        return prisma;
    } catch (err) {
        logger.error('Failed to connect to database', {
            error: err instanceof Error ? err.message : String(err),
        });
        throw err;
    }
}

/**
 * Get the existing Prisma client instance.
 */
export function getDB(): PrismaClient {
    if (!prisma) {
        throw new Error('Database not initialized. Call initDB first.');
    }
    return prisma;
}

/**
 * Disconnect the Prisma client gracefully.
 */
export async function disconnectDB(): Promise<void> {
    if (prisma) {
        await prisma.$disconnect();
        logger.info('Database connection closed');
    }
}
