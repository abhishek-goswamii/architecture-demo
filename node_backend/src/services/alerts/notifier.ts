// services/alerts/notifier.ts — Equivalent to go_backend/services/alerts/notifier.go

export type Level = 'INFO' | 'WARN' | 'ERROR';

export const LevelInfo: Level = 'INFO';
export const LevelWarn: Level = 'WARN';
export const LevelError: Level = 'ERROR';

/**
 * Notifier interface — equivalent to Go's Notifier interface.
 * Any alert channel (Discord, Slack, etc.) must implement this.
 */
export interface Notifier {
    send(level: Level, message: string): Promise<void>;
}
