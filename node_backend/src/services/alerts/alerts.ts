// services/alerts/alerts.ts — Equivalent to go_backend/services/alerts/alerts.go
import { Notifier, Level, LevelInfo, LevelWarn, LevelError } from './notifier';

let notifiers: Notifier[] = [];
let enabled: boolean = false;

/**
 * Initialize the alerting system with enabled notifiers.
 * Mirrors the Go Init function.
 */
export function init(isEnabled: boolean, ...enabledNotifiers: Notifier[]): void {
    enabled = isEnabled;
    notifiers = enabledNotifiers;
}

/**
 * Toggle the alerting system on/off.
 */
export function setEnabled(isEnabled: boolean): void {
    enabled = isEnabled;
}

/**
 * Send an info alert to all enabled channels.
 */
export function info(message: string): void {
    send(LevelInfo, message);
}

/**
 * Send a warning alert to all enabled channels.
 */
export function warn(message: string): void {
    send(LevelWarn, message);
}

/**
 * Send an error alert to all enabled channels.
 */
export function error(message: string): void {
    send(LevelError, message);
}

function send(level: Level, message: string): void {
    if (!enabled) {
        return;
    }

    for (const notifier of notifiers) {
        // Fire and forget — mirrors Go's goroutine dispatch
        notifier.send(level, message).catch((err) => {
            console.error(`Failed to send alert via notifier: ${err}`);
        });
    }
}

export { LevelInfo, LevelWarn, LevelError };
