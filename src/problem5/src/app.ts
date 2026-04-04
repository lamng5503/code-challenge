import express, { Application } from "express";
import { DataSource } from "typeorm";
import swaggerUi from "swagger-ui-express";
import { createItemRouter } from "./routes/item.routes";
import { errorHandler } from "./middleware/errorHandler";
import { swaggerSpec } from "./docs/swagger";

export function createApp(db: DataSource): Application {
  const app = express();

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use("/items", createItemRouter(db));

  app.use((_req, res) => {
    res.status(404).json({ error: "Route not found" });
  });

  app.use(errorHandler);

  return app;
}
