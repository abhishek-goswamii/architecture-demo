package alerts

type Level string

const (
	LevelInfo  Level = "INFO"
	LevelWarn  Level = "WARN"
	LevelError Level = "ERROR"
)

type Notifier interface {
	Send(level Level, message string) error
}
