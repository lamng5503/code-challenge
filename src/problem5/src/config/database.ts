import "reflect-metadata";
import { DataSource } from "typeorm";
import { ItemEntity } from "../entities/item.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  database: process.env.DB_NAME || "items_db",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  entities: [ItemEntity],
  synchronize: true,
  logging: false,
});
