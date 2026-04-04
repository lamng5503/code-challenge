import { z } from "zod";

export interface Item {
  id: number;
  name: string;
  description: string | null;
  status: "active" | "inactive" | "archived";
  created_at: Date;
  updated_at: Date;
}

const ItemStatusEnum = z.enum(["active", "inactive", "archived"]);

export const CreateItemSchema = z.object({
  name: z.string().trim().min(1, "name is required"),
  description: z.string().trim().optional(),
  status: ItemStatusEnum.default("active"),
});
export type CreateItemDto = z.infer<typeof CreateItemSchema>;

export const UpdateItemSchema = z
  .object({
    name: z.string().trim().min(1, "name must not be empty").optional(),
    description: z.string().trim().optional().nullable(),
    status: ItemStatusEnum.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "at least one field must be provided",
  });
export type UpdateItemDto = z.infer<typeof UpdateItemSchema>;

export const ListItemsQuerySchema = z.object({
  status: ItemStatusEnum.optional(),
  name: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
export type ListItemsQuery = z.infer<typeof ListItemsQuerySchema>;
