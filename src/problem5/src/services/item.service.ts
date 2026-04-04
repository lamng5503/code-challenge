import { ItemRepository } from "../repositories/item.repository";
import { Item, CreateItemDto, UpdateItemDto, ListItemsQuery } from "../models/item.model";
import { NotFoundError } from "../errors/AppError";

export interface PaginatedItems {
  items: Item[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ItemService {
  constructor(private readonly repository: ItemRepository) {}

  async create(dto: CreateItemDto): Promise<Item> {
    return this.repository.create(dto);
  }

  async list(query: ListItemsQuery): Promise<PaginatedItems> {
    const { items, total } = await this.repository.findAll(query);
    return {
      items,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    };
  }

  async getById(id: number): Promise<Item> {
    const item = await this.repository.findById(id);
    if (!item) throw new NotFoundError(`Item with id ${id} not found`);
    return item;
  }

  async update(id: number, dto: UpdateItemDto): Promise<Item> {
    await this.getById(id);
    const updated = await this.repository.update(id, dto);
    if (!updated) throw new NotFoundError(`Item with id ${id} not found`);
    return updated;
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) throw new NotFoundError(`Item with id ${id} not found`);
  }
}
