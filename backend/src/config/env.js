import dotenv from "dotenv";

dotenv.config();

// 🔒 función para validar variables obligatorias
const required = (value, name) => {
  if (!value) {
    throw new Error(`❌ Falta la variable de entorno: ${name}`);
  }
  return value;
};

// 🔒 validar NODE_ENV
const NODE_ENV = process.env.NODE_ENV || "development";

if (!["development", "production", "test"].includes(NODE_ENV)) {
  throw new Error("❌ NODE_ENV inválido");
}

// 📦 configuración centralizada
export const env = Object.freeze({
  PORT: Number(process.env.PORT) || 3000,

  // entorno
  NODE_ENV,

  // logging
  LOG_LEVEL: process.env.LOG_LEVEL || "info",

  // backend
  BACKEND_URL: process.env.BACKEND_URL || "http://localhost",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:4321",

  // base de datos
  DB: {
    NAME: required(process.env.BD_NOMBRE, "BD_NOMBRE"),
    USER: required(process.env.BD_USER, "BD_USER"),
    PASS:
      NODE_ENV === "production"
        ? required(process.env.BD_PASS, "BD_PASS")
        : (process.env.BD_PASS ?? ""),
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

  // ☁️ cloudinary
  CLOUDINARY: {
    CLOUD_NAME: required(
      process.env.CLOUDINARY_CLOUD_NAME,
      "CLOUDINARY_CLOUD_NAME",
    ),
    API_KEY: required(process.env.CLOUDINARY_API_KEY, "CLOUDINARY_API_KEY"),
    API_SECRET: required(
      process.env.CLOUDINARY_API_SECRET,
      "CLOUDINARY_API_SECRET",
    ),
  },
});
