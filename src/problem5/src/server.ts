import "reflect-metadata";
import "dotenv/config";
import { AppDataSource } from "./config/database";
import { createApp } from "./app";

const PORT = process.env.PORT || 3000;

async function main(): Promise<void> {
  await AppDataSource.initialize();

  const app = createApp(AppDataSource);
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
