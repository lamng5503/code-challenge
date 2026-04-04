import { DataSource, ILike } from "typeorm";
import { ItemEntity } from "../entities/item.entity";
import { Item, CreateItemDto, UpdateItemDto, ListItemsQuery } from "../models/item.model";

export class ItemRepository {
  private readonly repo;

  constructor(db: DataSource) {
    this.repo = db.getRepository(ItemEntity);
  }

  async create(dto: CreateItemDto): Promise<Item> {
    const item = this.repo.create({
      name: dto.name,
      description: dto.description ?? null,
      status: dto.status,
    });
    return this.repo.save(item);
  }

  async findAll(query: ListItemsQuery): Promise<{ items: Item[]; total: number }> {
    const where: Record<string, unknown> = {};

    if (query.status) where.status = query.status;
    if (query.name) where.name = ILike(`%${query.name}%`);

    const [items, total] = await this.repo.findAndCount({
      where,
      order: { created_at: "DESC" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });

    return { items, total };
  }

  async findById(id: number): Promise<Item | null> {
    return this.repo.findOneBy({ id });
  }

  async update(id: number, dto: UpdateItemDto): Promise<Item | null> {
    await this.repo.update(id, {
      ...(dto.name !== undefined && { name: dto.name }),
      ...("description" in dto && { description: dto.description ?? null }),
      ...(dto.status !== undefined && { status: dto.status }),
    });
    return this.repo.findOneBy({ id });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
