// main.ts — Equivalent to go_backend/main.go
import express from 'express';
import http from 'http';
import { loadConfig } from './config/config';
import logger from './logger/logger';
import * as alerts from './services/alerts/alerts';
import { DiscordNotifier } from './services/alerts/discord';
import { initDB, disconnectDB } from './database/connection';
import { PrismaUserDBOps } from './dbops/user_dbops';
import { UserServiceImpl } from './services/user_service';
import { UserController } from './controllers/user_controller';
import { loggerMiddleware } from './middlewares/logger';
import { recoveryMiddleware } from './middlewares/recovery';
import { registerRoutes } from './routes/routes';

async function main(): Promise<void> {
    // 1. Load configuration
    const cfg = loadConfig();

    // 2. Initialize Logger
    logger.init(cfg.environment);

    // 3. Initialize Alert Service
    alerts.init(cfg.discordAlertsEnabled, new DiscordNotifier(cfg.discordWebhookUrl));

    logger.info('Starting server', { port: cfg.port, env: cfg.environment });

    // 4. Initialize Database
    const db = initDB(cfg);

    // 5. Setup Dependency Injection
    const userDBOps = new PrismaUserDBOps(db);
    const userService = new UserServiceImpl(userDBOps);
    const userController = new UserController(userService);

    // 6. Setup Express App
    const app = express();

    // Parse JSON bodies
    app.use(express.json());

    // 7. Register Global Middlewares
    app.use(loggerMiddleware);

    // 8. Register Routes
    const apiRoutes = registerRoutes(userController);
    app.use('/api', apiRoutes);

    // 9. Register Error Handler (must be after routes)
    app.use(recoveryMiddleware);

    // 10. Configure HTTP Server
    const server = http.createServer(app);
    server.setTimeout(10000); // ReadTimeout + WriteTimeout equivalent
    server.keepAliveTimeout = 120000; // IdleTimeout equivalent

    // 11. Start Server
    server.listen(parseInt(cfg.port, 10), () => {
        logger.info(`Server listening on port ${cfg.port}`);
    });

    // 12. Graceful Shutdown
    const shutdown = async (signal: string): Promise<void> => {
        logger.info(`Received ${signal}. Shutting down server...`);

        server.close(async () => {
            logger.info('HTTP server closed');

            await disconnectDB();
            logger.info('Server exiting');
            process.exit(0);
        });

        // Force shutdown after 5 seconds
        setTimeout(() => {
            logger.error('Server forced to shutdown');
            process.exit(1);
        }, 5000);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
