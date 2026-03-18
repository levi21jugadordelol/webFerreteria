import dotenv from "dotenv";

dotenv.config();

const required = (value, name) => {
  if (!value) {
    throw new Error(`❌ La variable ${name} no está definida en .env`);
  }
  return value;
};

export const env = {
  PORT: Number(process.env.PORT) || 3000,

  // entorno
  NODE_ENV: process.env.NODE_ENV || "development",

  // logging
  LOG_LEVEL: process.env.LOG_LEVEL || "info",

  // backend
  BACKEND_URL: process.env.BACKEND_URL || "http://localhost",

  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:4321",

  // base de datos
  DB: {
    NAME: required(process.env.BD_NOMBRE, "BD_NOMBRE"),
    USER: required(process.env.BD_USER, "BD_USER"),
    PASS: process.env.BD_PASS ?? "",
    HOST: required(process.env.BD_HOST, "BD_HOST"),
    PORT: Number(process.env.BD_PORT) || 3306,
  },

  // email
  EMAIL: {
    HOST: required(process.env.EMAIL_HOST, "EMAIL_HOST"),
    PORT: Number(process.env.EMAIL_PORT) || 2525,
    USER: required(process.env.EMAIL_USER, "EMAIL_USER"),
    PASS: required(process.env.EMAIL_PASS, "EMAIL_PASS"),
  },

  // auth
  JWT_SECRET: required(process.env.JWT_SECRET, "JWT_SECRET"),
};
