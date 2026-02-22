import { ENVIRONMENT } from '@/constants';

function GetOriginFromDomain(domain: string | undefined) {
    if (!domain) return '';
    if (process.env.NEXT_PUBLIC_ENVIRONMENT === ENVIRONMENT.LOCAL) {
        return `http://${domain}`;
    }
    return `https://www.${domain}`;
}

function GetBackendBaseUrl() {
    const domain = process.env.NEXT_PUBLIC_BACKEND_DOMAIN;
    if (!domain) return 'http://localhost:8000/api'; // Default fallback
    const origin = GetOriginFromDomain(domain);
    const apiPostfix = '/api';
    return origin + apiPostfix;
}

type ConfigType = {
    BACKEND_BASE_URL: string;
    FRONTEND_URL: string;
    ENVIRONMENT: string;
};

export const CONFIG: ConfigType = {
    BACKEND_BASE_URL: GetBackendBaseUrl(),
    FRONTEND_URL: GetOriginFromDomain(process.env.NEXT_PUBLIC_FRONTEND_DOMAIN) || 'unknown',
    ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT || 'local',
} as const;

export type Config = typeof CONFIG;
