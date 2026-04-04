import { OpenAPIV3 } from "openapi-types";

const itemSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  properties: {
    id: { type: "integer", example: 1 },
    name: { type: "string", example: "Widget" },
    description: { type: "string", nullable: true, example: "A small widget" },
    status: { type: "string", enum: ["active", "inactive", "archived"], example: "active" },
    created_at: { type: "string", format: "date-time" },
    updated_at: { type: "string", format: "date-time" },
  },
};

const errorSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  properties: {
    error: { type: "string" },
  },
};

const validationErrorSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  properties: {
    error: { type: "string", example: "Validation failed" },
    details: {
      type: "array",
      items: {
        type: "object",
        properties: {
          path: { type: "string" },
          message: { type: "string" },
        },
      },
    },
  },
};

export const swaggerSpec: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "Items API",
    version: "1.0.0",
    description: "CRUD REST API for managing items",
  },
  paths: {
    "/health": {
      get: {
        summary: "Health check",
        tags: ["Health"],
        responses: {
          "200": {
            description: "Service is healthy",
            content: {
              "application/json": {
                schema: { type: "object", properties: { status: { type: "string", example: "ok" } } },
              },
            },
          },
        },
      },
    },
    "/items": {
      post: {
        summary: "Create an item",
        tags: ["Items"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string", example: "Widget" },
                  description: { type: "string", example: "A small widget" },
                  status: { type: "string", enum: ["active", "inactive", "archived"], default: "active" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Item created",
            content: { "application/json": { schema: itemSchema } },
          },
          "400": {
            description: "Validation error",
            content: { "application/json": { schema: validationErrorSchema } },
          },
        },
      },
      get: {
        summary: "List items",
        tags: ["Items"],
        parameters: [
          { name: "status", in: "query", schema: { type: "string", enum: ["active", "inactive", "archived"] } },
          { name: "name", in: "query", description: "Case-insensitive partial match", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20, maximum: 100 } },
        ],
        responses: {
          "200": {
            description: "Paginated list of items",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { type: "array", items: itemSchema },
                    pagination: {
                      type: "object",
                      properties: {
                        page: { type: "integer" },
                        limit: { type: "integer" },
                        total: { type: "integer" },
                        totalPages: { type: "integer" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/items/{id}": {
      get: {
        summary: "Get an item by ID",
        tags: ["Items"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Item found", content: { "application/json": { schema: itemSchema } } },
          "404": { description: "Item not found", content: { "application/json": { schema: errorSchema } } },
        },
      },
      put: {
        summary: "Update an item",
        tags: ["Items"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string", nullable: true },
                  status: { type: "string", enum: ["active", "inactive", "archived"] },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Item updated", content: { "application/json": { schema: itemSchema } } },
          "400": { description: "Validation error", content: { "application/json": { schema: validationErrorSchema } } },
          "404": { description: "Item not found", content: { "application/json": { schema: errorSchema } } },
        },
      },
      delete: {
        summary: "Delete an item",
        tags: ["Items"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "204": { description: "Item deleted" },
          "404": { description: "Item not found", content: { "application/json": { schema: errorSchema } } },
        },
      },
    },
  },
};
