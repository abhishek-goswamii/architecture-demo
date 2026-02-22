// middlewares/recovery.ts — Equivalent to go_backend/middlewares/recovery.go
import { Request, Response, NextFunction } from 'express';
import logger from '../logger/logger';
import * as alerts from '../services/alerts/alerts';
import * as apiResponse from '../utils/response';

/**
 * Recovery (error handler) middleware — catches unhandled errors and panics.
 * Mirrors the Go Recovery middleware.
 *
 * NOTE: In Express, this must be registered AFTER all routes (error-handling middleware).
 * Express error-handling middleware has 4 parameters (err, req, res, next).
 */
export function recoveryMiddleware(
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction,
): void {
    const stack = err.stack || '';

    logger.error('Recovery from panic', {
        error: err.message,
        stack,
    });

    // Send alert
    alerts.error(`Panic recovered: ${err.message}\nStack: ${stack}`);

    apiResponse.error(res, 500, 'Internal Server Error');
}
