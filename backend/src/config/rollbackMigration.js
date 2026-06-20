import fs from "fs";
import path from "path";
import db from "./db.js";
import logger from "../shared/logger/logger.js";

const rollbacksPath = path.join(process.cwd(), "rollbacks");

export const rollbackLastMigration = async () => {
  logger.info("Starting rollback of last migration");

  const [rows] = await db.query(`
    SELECT name
    FROM migrations
    ORDER BY id DESC
    LIMIT 1
  `);

  if (!rows.length) {
    logger.warn("No migrations to rollback");
    return;
  }

  const migrationName = rows[0].name;
  const rollbackFile = migrationName.replace(".sql", ".down.sql");
  const rollbackPath = path.join(rollbacksPath, rollbackFile);

  if (!fs.existsSync(rollbackPath)) {
    throw new Error(`Rollback file not found: ${rollbackFile}`);
  }

  const sql = fs.readFileSync(rollbackPath, "utf8").trim();

  if (!sql) {
    throw new Error(`Rollback file is empty: ${rollbackFile}`);
  }

  const transaction = await db.transaction();

  try {
    logger.info(`Running rollback: ${rollbackFile}`);

    await db.query(sql, { transaction });

    await db.query("DELETE FROM migrations WHERE name = :name", {
      replacements: { name: migrationName },
      transaction,
    });

    await transaction.commit();

    logger.info(`Rollback done: ${migrationName}`);
  } catch (error) {
    await transaction.rollback();

    logger.error({
      message: `Rollback failed: ${migrationName}`,
      error: error.message,
      sqlMessage: error.parent?.sqlMessage,
      sql: error.sql,
    });

    throw error;
  }
};
