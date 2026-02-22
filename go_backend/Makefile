.PHONY: all build run test clean db-up db-down db-logs tidy

# Default target
all: build

# Build the application
build:
	go build -o server main.go

# Run the application
run:
	go run main.go

# Run migrations
migrate:
	go run scripts/migrate.go

# Run the application in watch mode (requires air - optional but recommended for local dev)
dev:
	make db-up
	make run

# Run tests
test:
	go test -v ./...

# Run tests with coverage
test-cover:
	go test -v -cover ./...

# Tidy go modules
tidy:
	go mod tidy

# Clean built binary
clean:
	rm -f server

# Start database using docker-compose
db-up:
	docker compose up -d

# Stop database using docker-compose
db-down:
	docker compose down

# Tail database logs
db-logs:
	docker compose logs -f db
