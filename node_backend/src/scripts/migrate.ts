// scripts/migrate.ts — Equivalent to go_backend/scripts/migrate.go
import { loadConfig } from '../config/config';
import { initDB, disconnectDB } from '../database/connection';
import { runMigrations } from '../database/migration';
import logger from '../logger/logger';

/**
 * Standalone migration script.
 * Run with: npm run migrate
 */
async function main(): Promise<void> {
    const cfg = loadConfig();

    logger.init(cfg.environment);
    logger.info('Running standalone migration...');

    // Initialize DB to validate connection
    initDB(cfg);

    try {
        await runMigrations(cfg.environment);
        logger.info('Migration finished successfully');
    } catch (err) {
        logger.error('Migration failed', {
            error: err instanceof Error ? err.message : String(err),
        });
        process.exit(1);
    } finally {
        await disconnectDB();
    }
}

main();
