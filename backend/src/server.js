import app from "./app.js";
import db from "./config/db.js";
import { env } from "./config/env.js";
import logger from "./shared/logger/logger.js";
import { runMigrations } from "./config/runMigrations.js";

// ⏰ Jobs
import "./jobs/pagosCron.js";

// 🗃️ Modelos
import "../models/index.js";

const startServer = async () => {
  try {
    // 🔌 Conectar a la BD
    await db.authenticate();
    logger.info("Database connected successfully");

    // 🔥 SOLO migraciones
    await runMigrations();

    // 🚀 Levantar servidor
    app.listen(env.PORT, () => {
      logger.info(`Server running at ${env.BACKEND_URL}:${env.PORT}`);
    });
  } catch (error) {
    logger.error({
      message: "Database connection failed",
      error: error.message,
    });

    process.exit(1); // 💥 importante en producción
  }
};

export default startServer;
