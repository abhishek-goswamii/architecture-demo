// database/migration.ts — Equivalent to go_backend/database/migration.go
import { execSync } from 'child_process';
import logger from '../logger/logger';

/**
 * Run Prisma migrations.
 * In Go we use GORM AutoMigrate; here we use Prisma's migrate deploy for production
 * or db push for development.
 */
export async function runMigrations(environment: string): Promise<void> {
    logger.info('Running database migrations...');

    try {
        if (environment === 'production') {
            // In production, apply pending migrations
            execSync('npx prisma migrate deploy', { stdio: 'inherit' });
        } else {
            // In development, push schema changes directly
            execSync('npx prisma db push', { stdio: 'inherit' });
        }

        logger.info('Migrations completed successfully');
    } catch (err) {
        logger.error('Migration failed', {
            error: err instanceof Error ? err.message : String(err),
        });
        throw err;
    }
}
