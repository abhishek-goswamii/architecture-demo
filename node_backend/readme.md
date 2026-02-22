# Node Backend

Node.js + Express + Prisma + TypeScript backend — architecture demo.

## Structure

```
node_backend/
├── src/
│   ├── config/           # Environment configuration (dotenv)
│   ├── controllers/      # HTTP request handlers
│   ├── database/         # Prisma client connection & migration
│   ├── dbops/            # Database operations layer (repository pattern)
│   ├── entities/         # Type definitions / models
│   ├── logger/           # Winston logger with context-aware child loggers
│   ├── middlewares/      # Express middlewares (logger, error recovery)
│   ├── routes/           # Route registration
│   ├── scripts/          # Standalone scripts (migration runner)
│   ├── services/         # Business logic layer
│   │   └── alerts/       # Alert system (Discord notifications)
│   ├── utils/            # Response helpers
│   └── main.ts           # Application entrypoint
├── prisma/
│   └── schema.prisma     # Prisma schema (database models)
├── docker-compose.yml    # PostgreSQL container
├── Makefile              # Common commands
├── package.json
└── tsconfig.json
```

## Quick Start

```bash
# Install dependencies
make install

# Start PostgreSQL
make db-up

# Run migrations
make migrate

# Start development server
make dev
```

## Available Commands

| Command          | Description                          |
|------------------|--------------------------------------|
| `make install`   | Install npm dependencies             |
| `make dev`       | Start DB + dev server (watch mode)   |
| `make build`     | Compile TypeScript to JavaScript     |
| `make run`       | Run compiled application             |
| `make test`      | Run tests                            |
| `make test-cover`| Run tests with coverage              |
| `make migrate`   | Run database migrations              |
| `make db-up`     | Start PostgreSQL container           |
| `make db-down`   | Stop PostgreSQL container            |
| `make db-logs`   | Tail database logs                   |
| `make clean`     | Remove build output                  |
