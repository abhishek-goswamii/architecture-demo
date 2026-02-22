// logger/logger.ts — Equivalent to go_backend/logger/logger.go
import winston from 'winston';
import { Request } from 'express';

const LOGGER_KEY = 'logger';

let globalLogger: winston.Logger;

/**
 * Initialize the global logger.
 * In production, logs are JSON-formatted. In development, colorized console output.
 */
function init(env: string): void {
    const isProduction = env === 'production';

    globalLogger = winston.createLogger({
        level: isProduction ? 'info' : 'debug',
        format: isProduction
            ? winston.format.combine(winston.format.timestamp(), winston.format.json())
            : winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.printf(({ timestamp, level, message, ...meta }) => {
                    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
                    return `${timestamp} ${level}: ${message}${metaStr}`;
                }),
            ),
        transports: [new winston.transports.Console()],
    });
}

/**
 * Get the global logger instance.
 */
function getLogger(): winston.Logger {
    if (!globalLogger) {
        // Fallback: initialize with development mode if not explicitly initialized
        init('development');
    }
    return globalLogger;
}

/**
 * Create a child logger with additional metadata (e.g., request_id).
 */
function createChildLogger(meta: Record<string, string>): winston.Logger {
    return getLogger().child(meta);
}

/**
 * Retrieve logger from Express request object.
 * Falls back to global logger if not found.
 */
function getLoggerFromRequest(req: Request): winston.Logger {
    const reqLogger = (req as any)[LOGGER_KEY];
    if (reqLogger) {
        return reqLogger as winston.Logger;
    }
    return getLogger();
}

/**
 * Attach a logger to the Express request object.
 */
function setLoggerOnRequest(req: Request, logger: winston.Logger): void {
    (req as any)[LOGGER_KEY] = logger;
}

// Convenience wrapper functions (mirrors Go package-level functions)
function info(message: string, meta?: Record<string, any>): void {
    getLogger().info(message, meta);
}

function error(message: string, meta?: Record<string, any>): void {
    getLogger().error(message, meta);
}

function warn(message: string, meta?: Record<string, any>): void {
    getLogger().warn(message, meta);
}

function debug(message: string, meta?: Record<string, any>): void {
    getLogger().debug(message, meta);
}

function fatal(message: string, meta?: Record<string, any>): void {
    getLogger().error(`FATAL: ${message}`, meta);
    process.exit(1);
}

export default {
    LOGGER_KEY,
    init,
    getLogger,
    createChildLogger,
    getLoggerFromRequest,
    setLoggerOnRequest,
    info,
    error,
    warn,
    debug,
    fatal,
};
