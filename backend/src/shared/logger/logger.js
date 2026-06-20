import pino from "pino";
import { env } from "../../config/env.js";

const isDev = env.NODE_ENV !== "production";

const logger = pino({
  level: env.LOG_LEVEL || "info",

  redact: {
    paths: [
      "password",
      "hash",
      "token",
      "authorization",
      "cookie",
      "req.headers.authorization",
      "req.headers.cookie",
      "*.password",
      "*.hash",
      "*.token",
      "*.authorization",
      "*.cookie",
    ],
    censor: "[REDACTED]",
  },

  transport: isDev
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined,
});
export default logger;
