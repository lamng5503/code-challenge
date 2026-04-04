import { Pool } from "pg";
import { Item, CreateItemDto, UpdateItemDto, ListItemsQuery } from "../models/item.model";

export class ItemRepository {
  constructor(private readonly db: Pool) {}

  async create(dto: CreateItemDto): Promise<Item> {
    const { rows } = await this.db.query<Item>(
      `INSERT INTO items (name, description, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [dto.name, dto.description ?? null, dto.status],
    );
    return rows[0];
  }

  async findAll(query: ListItemsQuery): Promise<{ items: Item[]; total: number }> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (query.status) {
      conditions.push(`status = $${idx++}`);
      params.push(query.status);
    }
    if (query.name) {
      conditions.push(`name ILIKE $${idx++}`);
      params.push(`%${query.name}%`);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const offset = (query.page - 1) * query.limit;

    const [countResult, itemsResult] = await Promise.all([
      this.db.query<{ count: string }>(`SELECT COUNT(*) FROM items ${where}`, params),
      this.db.query<Item>(
        `SELECT * FROM items ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
        [...params, query.limit, offset],
      ),
    ]);

    return {
      items: itemsResult.rows,
      total: parseInt(countResult.rows[0].count, 10),
    };
  }

  async findById(id: number): Promise<Item | null> {
    const { rows } = await this.db.query<Item>(`SELECT * FROM items WHERE id = $1`, [id]);
    return rows[0] ?? null;
  }

  async update(id: number, dto: UpdateItemDto): Promise<Item | null> {
    const setClauses: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (dto.name !== undefined) {
      setClauses.push(`name = $${idx++}`);
      params.push(dto.name);
    }
    if ("description" in dto) {
      setClauses.push(`description = $${idx++}`);
      params.push(dto.description ?? null);
    }
    if (dto.status !== undefined) {
      setClauses.push(`status = $${idx++}`);
      params.push(dto.status);
    }

    setClauses.push(`updated_at = NOW()`);
    params.push(id);

    const { rows } = await this.db.query<Item>(
      `UPDATE items SET ${setClauses.join(", ")} WHERE id = $${idx} RETURNING *`,
      params,
    );
    return rows[0] ?? null;
  }

  async delete(id: number): Promise<boolean> {
    const { rowCount } = await this.db.query(`DELETE FROM items WHERE id = $1`, [id]);
    return (rowCount ?? 0) > 0;
  }
}
