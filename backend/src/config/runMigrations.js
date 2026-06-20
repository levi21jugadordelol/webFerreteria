import fs from "fs";
import path from "path";
import db from "./db.js";
import logger from "../shared/logger/logger.js";

const migrationsPath = path.join(process.cwd(), "migrations");

export const runMigrations = async () => {
  logger.info("Running database migrations");
  logger.info({ migrationsPath });

  await db.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const [executed] = await db.query("SELECT name FROM migrations");
  const executedNames = executed.map((m) => m.name);

  const files = fs
    .readdirSync(migrationsPath)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    if (executedNames.includes(file)) {
      logger.warn(`Skipping migration: ${file}`);
      continue;
    }

    const filePath = path.join(migrationsPath, file);
    const sql = fs.readFileSync(filePath, "utf8").trim();

    const statements = sql
      .split(";")
      .map((statement) => statement.trim())
      .filter(Boolean);

    if (!sql) {
      logger.warn(`Skipping empty migration: ${file}`);
      continue;
    }

    logger.info(`Running migration: ${file}`);

    const transaction = await db.transaction();

    try {
      for (const statement of statements) {
        await db.query(statement, { transaction });
      }

      await db.query("INSERT INTO migrations (name) VALUES (:name)", {
        replacements: { name: file },
        transaction,
      });

      await transaction.commit();

      logger.info(`✅ Migration done: ${file}`);
    } catch (error) {
      await transaction.rollback();

      logger.error({
        message: `❌ Migration failed: ${file}`,
        error: error.message,
        sqlMessage: error.parent?.sqlMessage,
        sql: error.sql,
      });

      process.exit(1);
    }
  }
};
