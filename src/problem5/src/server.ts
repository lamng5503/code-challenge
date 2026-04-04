import "dotenv/config";
import { createPool, runMigrations } from "./config/database";
import { createApp } from "./app";

const PORT = process.env.PORT || 3000;

async function main(): Promise<void> {
  const db = createPool();
  await runMigrations(db);

  const app = createApp(db);
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
