// middlewares/logger.ts — Equivalent to go_backend/middlewares/logger.go
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger from '../logger/logger';

/**
 * Logger middleware — generates request ID, creates child logger, logs request completion.
 * Mirrors the Go Logger middleware with request_id, latency, status, etc.
 */
export function loggerMiddleware(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();
    const path = req.path;
    const query = req.url.includes('?') ? req.url.split('?')[1] : '';

    // 1. Generate Request ID
    const reqId = uuidv4();
    res.setHeader('X-Request-ID', reqId);

    // 2. Create child logger with request_id
    const childLogger = logger.createChildLogger({ request_id: reqId });

    // 3. Store logger on request object
    logger.setLoggerOnRequest(req, childLogger);

    // 4. Log on response finish
    res.on('finish', () => {
        const latency = Date.now() - start;
        const status = res.statusCode;

        childLogger.info('Request completed', {
            status,
            method: req.method,
            path,
            query,
            ip: req.ip || req.socket.remoteAddress,
            latency: `${latency}ms`,
            'user-agent': req.get('user-agent'),
        });
    });

    next();
}
