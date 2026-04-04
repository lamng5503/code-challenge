# Problem 5 — A Crude Server

A CRUD REST API built with **Express.js**, **TypeScript**, **TypeORM**, and **PostgreSQL**, following a **Layered Architecture** pattern.

```
Routes → Controllers → Services → Repositories → TypeORM DataSource → PostgreSQL
```

---

## Requirements

- Docker & Docker Compose (recommended)
- **or** Node.js >= 18 + a running PostgreSQL instance

---

## Running with Docker (recommended)

```bash
cd src/problem5

# Copy env file and adjust if needed
cp .env.example .env

# Build and start both the app and PostgreSQL
docker compose up --build
```

The server will be available at **http://localhost:3000**.  
The database schema is managed automatically by TypeORM (`synchronize: true`) on startup.

To stop and remove containers:
```bash
docker compose down
# To also remove the database volume:
docker compose down -v
```

---

## Running locally (without Docker)

**1. Install dependencies**
```bash
cd src/problem5
npm install
```

**2. Configure environment**
```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

**3. Start the server**
```bash
# Development (ts-node, no build step)
npm run dev

# Production (compiled)
npm run build
npm start
```

---

## Environment variables

| Variable      | Default      | Description                    |
|---------------|--------------|--------------------------------|
| `PORT`        | `3000`       | Port the server listens on     |
| `DB_HOST`     | `localhost`  | PostgreSQL host                |
| `DB_PORT`     | `5432`       | PostgreSQL port                |
| `DB_NAME`     | `items_db`   | Database name                  |
| `DB_USER`     | `postgres`   | Database user                  |
| `DB_PASSWORD` | `postgres`   | Database password              |

---

## Project Structure

```
src/problem5/
├── src/                          # Application source code
│   ├── config/
│   │   └── database.ts           # TypeORM DataSource configuration
│   ├── entities/
│   │   └── item.entity.ts        # TypeORM entity (maps to the items table)
│   ├── errors/
│   │   └── AppError.ts           # Typed error hierarchy (AppError, NotFoundError, ValidationError)
│   ├── middleware/
│   │   └── errorHandler.ts       # Centralised error handling (Zod + AppError + unknown)
│   ├── models/
│   │   └── item.model.ts         # Zod schemas for request validation (DTOs)
│   ├── repositories/
│   │   └── item.repository.ts    # Data access layer — TypeORM repository methods
│   ├── services/
│   │   └── item.service.ts       # Business logic, orchestrates repositories
│   ├── controllers/
│   │   └── item.controller.ts    # HTTP layer — parse requests, call services, send responses
│   ├── routes/
│   │   └── item.routes.ts        # Wires controllers to Express Router
│   ├── app.ts                    # Express app factory (middleware, routes, 404)
│   └── server.ts                 # Entry point — initialise DataSource, start HTTP server
├── Dockerfile                    # Multi-stage build: builder → production image
├── docker-compose.yml            # Orchestrates app + postgres:16-alpine
├── .env.example                  # Environment variable template
├── package.json
└── tsconfig.json
```

### Layer responsibilities

| Layer | File(s) | Responsibility |
|---|---|---|
| **Routes** | `routes/item.routes.ts` | Map HTTP methods + paths to controller handlers |
| **Controllers** | `controllers/item.controller.ts` | Parse & validate HTTP input, format HTTP response |
| **Services** | `services/item.service.ts` | Business rules, pagination logic, error semantics |
| **Repositories** | `repositories/item.repository.ts` | Data access via TypeORM — no business logic |
| **Entities** | `entities/item.entity.ts` | TypeORM entity definition (table schema) |
| **Models** | `models/item.model.ts` | Zod validation schemas for request DTOs |
| **Config** | `config/database.ts` | TypeORM DataSource (connection + schema sync) |
| **Errors** | `errors/AppError.ts` | Typed error classes mapped to HTTP status codes |
| **Middleware** | `middleware/errorHandler.ts` | Catches and normalises all errors into JSON responses |

---

## API Reference

### Health check

```
GET /health
```
```json
{ "status": "ok" }
```

---

### Create an item

```
POST /items
Content-Type: application/json
```

| Field         | Type   | Required | Description                                     |
|---------------|--------|----------|-------------------------------------------------|
| `name`        | string | Yes      | Item name                                       |
| `description` | string | No       | Optional description                            |
| `status`      | string | No       | `active` (default) \| `inactive` \| `archived` |

```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Widget", "description": "A small widget", "status": "active"}'
```

**Response** `201 Created`
```json
{
  "id": 1,
  "name": "Widget",
  "description": "A small widget",
  "status": "active",
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:00:00.000Z"
}
```

---

### List items

```
GET /items
```

| Query param | Type   | Description                                          |
|-------------|--------|------------------------------------------------------|
| `status`    | string | Filter by `active`, `inactive`, or `archived`        |
| `name`      | string | Case-insensitive partial name match                  |
| `page`      | number | Page number (default: `1`)                           |
| `limit`     | number | Items per page, max 100 (default: `20`)              |

```bash
curl "http://localhost:3000/items?status=active&name=widget&page=1&limit=10"
```

**Response** `200 OK`
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

### Get a single item

```
GET /items/:id
```

```bash
curl http://localhost:3000/items/1
```

**Response** `200 OK` — returns the item object.

---

### Update an item

```
PUT /items/:id
Content-Type: application/json
```

All fields are optional; at least one must be provided.

```bash
curl -X PUT http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "archived"}'
```

**Response** `200 OK` — returns the updated item.

---

### Delete an item

```
DELETE /items/:id
```

```bash
curl -X DELETE http://localhost:3000/items/1
```

**Response** `204 No Content`

---

## Error responses

```json
{ "error": "Human-readable message" }
```

Validation errors (Zod):
```json
{
  "error": "Validation failed",
  "details": [{ "path": "name", "message": "name is required" }]
}
```

| Status | Meaning              |
|--------|----------------------|
| `400`  | Validation error     |
| `404`  | Item not found       |
| `500`  | Internal server error|
