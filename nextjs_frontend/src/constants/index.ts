export const ENVIRONMENT = {
    LOCAL: 'local',
    PRODUCTION: 'production',
    UAT: 'uat',
} as const;

export type Environment = (typeof ENVIRONMENT)[keyof typeof ENVIRONMENT];
