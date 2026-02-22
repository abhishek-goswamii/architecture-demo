package alerts

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type DiscordNotifier struct {
	WebhookURL string
}

type DiscordPayload struct {
	Embeds []DiscordEmbed `json:"embeds"`
}

type DiscordEmbed struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Color       int    `json:"color"`
	Timestamp   string `json:"timestamp"`
}

func NewDiscordNotifier(url string) *DiscordNotifier {
	return &DiscordNotifier{WebhookURL: url}
}

func (d *DiscordNotifier) Send(level Level, message string) error {
	if d.WebhookURL == "" {
		return nil // Discord not configured
	}

	color := 0x00ff00 // Green for info
	if level == LevelWarn {
		color = 0xffa500 // Orange for warn
	} else if level == LevelError {
		color = 0xff0000 // Red for error
	}

	payload := DiscordPayload{
		Embeds: []DiscordEmbed{
			{
				Title:       fmt.Sprintf("[%s] Alert", level),
				Description: message,
				Color:       color,
				Timestamp:   time.Now().Format(time.RFC3339),
			},
		},
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	resp, err := http.Post(d.WebhookURL, "application/json", bytes.NewBuffer(body))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		return fmt.Errorf("discord responded with status: %d", resp.StatusCode)
	}

	return nil
}
