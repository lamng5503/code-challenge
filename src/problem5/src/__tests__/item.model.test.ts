import { CreateItemSchema, UpdateItemSchema, ListItemsQuerySchema } from "../models/item.model";

describe("CreateItemSchema", () => {
  it("accepts valid input with defaults", () => {
    const result = CreateItemSchema.parse({ name: "Widget" });
    expect(result.status).toBe("active");
    expect(result.description).toBeUndefined();
  });

  it("rejects empty name", () => {
    expect(() => CreateItemSchema.parse({ name: "" })).toThrow();
  });

  it("rejects invalid status", () => {
    expect(() => CreateItemSchema.parse({ name: "X", status: "unknown" })).toThrow();
  });
});

describe("UpdateItemSchema", () => {
  it("accepts partial updates", () => {
    expect(() => UpdateItemSchema.parse({ status: "archived" })).not.toThrow();
  });

  it("rejects empty object", () => {
    expect(() => UpdateItemSchema.parse({})).toThrow();
  });

  it("rejects empty name string", () => {
    expect(() => UpdateItemSchema.parse({ name: "" })).toThrow();
  });

  it("allows null description", () => {
    const result = UpdateItemSchema.parse({ description: null });
    expect(result.description).toBeNull();
  });
});

describe("ListItemsQuerySchema", () => {
  it("applies defaults for page and limit", () => {
    const result = ListItemsQuerySchema.parse({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });

  it("coerces string numbers", () => {
    const result = ListItemsQuerySchema.parse({ page: "2", limit: "5" });
    expect(result.page).toBe(2);
    expect(result.limit).toBe(5);
  });

  it("rejects limit over 100", () => {
    expect(() => ListItemsQuerySchema.parse({ limit: "101" })).toThrow();
  });
});
