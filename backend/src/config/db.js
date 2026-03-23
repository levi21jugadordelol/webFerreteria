import { Sequelize } from "sequelize";
import { env } from "./env.js";
import logger from "../shared/logger/logger.js";

const db = new Sequelize(env.DB.NAME, env.DB.USER, env.DB.PASS, {
  host: env.DB.HOST,
  port: env.DB.PORT,
  dialect: "mysql",
  define: {
    timestamps: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging:
    env.NODE_ENV === "development"
      ? (msg) => logger.debug({ message: msg })
      : false,
});

export default db;
