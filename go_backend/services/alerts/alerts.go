package alerts

import (
	"log"
	"sync"
)

var (
	notifiers []Notifier
	enabled   bool
	mu        sync.RWMutex
)

// Init initializes the alerting system with enabled notifiers
func Init(isEnabled bool, enabledNotifiers ...Notifier) {
	mu.Lock()
	defer mu.Unlock()
	enabled = isEnabled
	notifiers = enabledNotifiers
}

// SetEnabled toggles the alerting system
func SetEnabled(isEnabled bool) {
	mu.Lock()
	defer mu.Unlock()
	enabled = isEnabled
}

// Info shoots an info alert to all enabled channels
func Info(message string) {
	send(LevelInfo, message)
}

// Warn shoots a warning alert to all enabled channels
func Warn(message string) {
	send(LevelWarn, message)
}

// Error shoots an error alert to all enabled channels
func Error(message string) {
	send(LevelError, message)
}

func send(level Level, message string) {
	mu.RLock()
	defer mu.RUnlock()

	if !enabled {
		return
	}

	for _, n := range notifiers {
		go func(notifier Notifier) {
			if err := notifier.Send(level, message); err != nil {
				log.Printf("failed to send alert via notifier: %v", err)
			}
		}(n)
	}
}
