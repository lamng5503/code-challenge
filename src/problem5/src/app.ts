import express, { Application } from "express";
import { DataSource } from "typeorm";
import { createItemRouter } from "./routes/item.routes";
import { errorHandler } from "./middleware/errorHandler";

export function createApp(db: DataSource): Application {
  const app = express();

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/items", createItemRouter(db));

  app.use((_req, res) => {
    res.status(404).json({ error: "Route not found" });
  });

  app.use(errorHandler);

  return app;
}
