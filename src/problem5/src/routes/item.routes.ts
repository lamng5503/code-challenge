import { Router } from "express";
import { Pool } from "pg";
import { ItemRepository } from "../repositories/item.repository";
import { ItemService } from "../services/item.service";
import { ItemController } from "../controllers/item.controller";

export function createItemRouter(db: Pool): Router {
  const router = Router();

  const repository = new ItemRepository(db);
  const service = new ItemService(repository);
  const controller = new ItemController(service);

  router.post("/", controller.create);
  router.get("/", controller.list);
  router.get("/:id", controller.getById);
  router.put("/:id", controller.update);
  router.delete("/:id", controller.delete);

  return router;
}
