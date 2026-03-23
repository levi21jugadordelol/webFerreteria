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
    await db.authenticate();
    await db.sync();

    logger.info("Database connected successfully");

    app.listen(env.PORT, () => {
      logger.info(`Server running at ${env.BACKEND_URL}:${env.PORT}`);
    });
  } catch (error) {
    logger.error({
      message: "Database connection failed",
      error: error.message,
    });
  }
};

export default startServer;
