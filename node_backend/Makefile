.PHONY: all build run test clean db-up db-down db-logs install

# Default target
all: build

# Install dependencies
install:
	npm install

# Build the application
build:
	npm run build

# Run the application
run:
	npm start

# Run migrations
migrate:
	npm run migrate

# Run the application in watch mode (uses ts-node-dev)
dev:
	make db-up
	npm run dev

# Run tests
test:
	npm test

# Run tests with coverage
test-cover:
	npm run test:cover

# Generate Prisma client
db-generate:
	npx prisma generate

# Clean built output
clean:
	rm -rf dist

# Start database using docker-compose
db-up:
	docker compose up -d

# Stop database using docker-compose
db-down:
	docker compose down

# Tail database logs
db-logs:
	docker compose logs -f db
