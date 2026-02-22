// services/alerts/discord.ts — Equivalent to go_backend/services/alerts/discord.go
import { Notifier, Level, LevelWarn, LevelError } from './notifier';

interface DiscordEmbed {
    title: string;
    description: string;
    color: number;
    timestamp: string;
}

interface DiscordPayload {
    embeds: DiscordEmbed[];
}

/**
 * Discord Notifier — sends alerts via Discord webhook.
 * Mirrors the Go DiscordNotifier struct.
 */
export class DiscordNotifier implements Notifier {
    private webhookUrl: string;

    constructor(webhookUrl: string) {
        this.webhookUrl = webhookUrl;
    }

    async send(level: Level, message: string): Promise<void> {
        if (!this.webhookUrl) {
            return; // Discord not configured
        }

        let color = 0x00ff00; // Green for info
        if (level === LevelWarn) {
            color = 0xffa500; // Orange for warn
        } else if (level === LevelError) {
            color = 0xff0000; // Red for error
        }

        const payload: DiscordPayload = {
            embeds: [
                {
                    title: `[${level}] Alert`,
                    description: message,
                    color,
                    timestamp: new Date().toISOString(),
                },
            ],
        };

        const response = await fetch(this.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (response.status >= 300) {
            throw new Error(`Discord responded with status: ${response.status}`);
        }
    }
}
