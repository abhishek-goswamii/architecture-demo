// utils/response.ts — Equivalent to go_backend/utils/response.go
import { Response } from 'express';

interface ApiResponse {
    success: boolean;
    message: string;
    data?: any;
}

/**
 * Send a success JSON response.
 * Mirrors the Go utils.Success function.
 */
export function success(res: Response, status: number, message: string, data?: any): void {
    const response: ApiResponse = {
        success: true,
        message,
    };

    if (data !== undefined) {
        response.data = data;
    }

    res.status(status).json(response);
}

/**
 * Send an error JSON response.
 * Mirrors the Go utils.Error function (AbortWithStatusJSON equivalent).
 */
export function error(res: Response, status: number, message: string): void {
    res.status(status).json({
        success: false,
        message,
    } as ApiResponse);
}
