// Common types and interfaces for the application

export type ApiResponse<T> = {
    success: boolean;
    data: T;
    message?: string;
};

export type PaginatedResponse<T> = {
    success: boolean;
    data: T[];
    total: number;
    page: number;
    limit: number;
};
