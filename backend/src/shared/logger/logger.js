import pino from "pino";
import { env } from "../config/env.js";

const isDev = env.NODE_ENV !== "production";

const logger = pino({
  level: env.LOG_LEVEL || "info",
  transport: isDev
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
        },
      }
    : undefined,
});

export default logger;
