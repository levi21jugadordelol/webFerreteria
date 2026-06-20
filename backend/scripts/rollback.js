import db from "../src/config/db.js";
import { rollbackLastMigration } from "../src/config/rollbackMigration.js";

try {
  await db.authenticate();
  await rollbackLastMigration();
  process.exit(0);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
