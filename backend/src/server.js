import app from "./app.js";
import db from "./config/db.js";
import { env } from "./config/env.js";
import logger from "./shared/logger/logger.js";

// ⏰ Jobs
import "./jobs/pagosCron.js";

// 🗃️ Modelos
import "../models/index.js";

const startServer = async () => {
  try {
    // 🔌 Conectar a la BD
    await db.authenticate();
    logger.info("Database connected successfully");

    // ⚠️ SOLO en desarrollo
    if (env.NODE_ENV === "development") {
      await db.sync({ alter: true }); // puedes usar alter para ajustar tablas
      logger.warn("⚠️ Database sync enabled (development only)");
    }

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
