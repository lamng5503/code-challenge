import { ItemService } from "../services/item.service";
import { ItemRepository } from "../repositories/item.repository";
import { NotFoundError } from "../errors/AppError";
import { Item } from "../models/item.model";

const makeItem = (overrides: Partial<Item> = {}): Item => ({
  id: 1,
  name: "Widget",
  description: null,
  status: "active",
  created_at: new Date(),
  updated_at: new Date(),
  ...overrides,
});

const mockRepo = (): jest.Mocked<ItemRepository> =>
  ({
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }) as unknown as jest.Mocked<ItemRepository>;

describe("ItemService", () => {
  let repo: jest.Mocked<ItemRepository>;
  let service: ItemService;

  beforeEach(() => {
    repo = mockRepo();
    service = new ItemService(repo);
  });

  describe("create", () => {
    it("delegates to repository and returns the created item", async () => {
      const dto = { name: "Widget", status: "active" as const };
      const item = makeItem();
      repo.create.mockResolvedValue(item);

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(result).toBe(item);
    });
  });

  describe("list", () => {
    it("returns paginated result with correct metadata", async () => {
      const items = [makeItem(), makeItem({ id: 2 })];
      repo.findAll.mockResolvedValue({ items, total: 25 });

      const result = await service.list({ page: 2, limit: 10 });

      expect(result.items).toBe(items);
      expect(result.total).toBe(25);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(3);
    });
  });

  describe("getById", () => {
    it("returns the item when found", async () => {
      const item = makeItem();
      repo.findById.mockResolvedValue(item);

      const result = await service.getById(1);
      expect(result).toBe(item);
    });

    it("throws NotFoundError when item does not exist", async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.getById(99)).rejects.toThrow(NotFoundError);
    });
  });

  describe("update", () => {
    it("returns the updated item", async () => {
      const original = makeItem();
      const updated = makeItem({ name: "Updated" });
      repo.findById.mockResolvedValue(original);
      repo.update.mockResolvedValue(updated);

      const result = await service.update(1, { name: "Updated" });
      expect(result).toBe(updated);
    });

    it("throws NotFoundError when item does not exist before update", async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.update(99, { name: "X" })).rejects.toThrow(NotFoundError);
      expect(repo.update).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("resolves when item is deleted", async () => {
      repo.delete.mockResolvedValue(true);

      await expect(service.delete(1)).resolves.toBeUndefined();
    });

    it("throws NotFoundError when item does not exist", async () => {
      repo.delete.mockResolvedValue(false);

      await expect(service.delete(99)).rejects.toThrow(NotFoundError);
    });
  });
});
