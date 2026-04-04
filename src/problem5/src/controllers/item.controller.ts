import { Request, Response, NextFunction } from "express";
import { ItemService } from "../services/item.service";
import { CreateItemSchema, UpdateItemSchema, ListItemsQuerySchema } from "../models/item.model";

export class ItemController {
  constructor(private readonly service: ItemService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = CreateItemSchema.parse(req.body);
      const item = await this.service.create(dto);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = ListItemsQuerySchema.parse(req.query);
      const result = await this.service.list(query);
      res.json({
        data: result.items,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({ error: "id must be a number" });
        return;
      }
      const item = await this.service.getById(id);
      res.json(item);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({ error: "id must be a number" });
        return;
      }
      const dto = UpdateItemSchema.parse(req.body);
      const item = await this.service.update(id, dto);
      res.json(item);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({ error: "id must be a number" });
        return;
      }
      await this.service.delete(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
