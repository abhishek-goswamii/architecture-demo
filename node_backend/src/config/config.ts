// config/config.ts — Equivalent to go_backend/config/config.go
import dotenv from 'dotenv';

dotenv.config();

export interface Config {
    port: string;
    dbHost: string;
    dbPort: string;
    dbUser: string;
    dbPassword: string;
    dbName: string;
    environment: string;
    discordWebhookUrl: string;
    discordAlertsEnabled: boolean;
    databaseUrl: string;
}

function getEnv(key: string, fallback: string): string {
    return process.env[key] ?? fallback;
}

export function loadConfig(): Config {
    const dbHost = getEnv('DB_HOST', 'localhost');
    const dbPort = getEnv('DB_PORT', '4410');
    const dbUser = getEnv('DB_USER', 'syncflow');
    const dbPassword = getEnv('DB_PASSWORD', 'syncflow');
    const dbName = getEnv('DB_NAME', 'syncflow');

    if (!dbHost || !dbUser) {
        throw new Error('Missing essential configuration');
    }

    const databaseUrl =
        getEnv('DATABASE_URL', '') ||
        `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?schema=public`;

    return {
        port: getEnv('PORT', '4400'),
        dbHost,
        dbPort,
        dbUser,
        dbPassword,
        dbName,
        environment: getEnv('ENVIRONMENT', 'development'),
        discordWebhookUrl: getEnv('DISCORD_WEBHOOK_URL', ''),
        discordAlertsEnabled: getEnv('DISCORD_ALERTS_ENABLED', '0') === '1',
        databaseUrl,
    };
}
