// 📦 Variables de entorno
import dotenv from "dotenv";
dotenv.config();

// 🚀 Dependencias principales
import express from "express";
import chalk from "chalk";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// 🗃️ Base de datos y rutas
import db from "./config/db.js";
import "./models/index.js";
import admiRoutes from "./routes/administradorRouter.js";
import productoRoutes from "./routes/productoRouters.js";
import categoriaRoutes from "./routes/categoriaRouter.js"; // ✅ NUEVO
import marcaRoutes from "./routes/marcaRouter.js";
import precioRoutes from "./routes/precioRouters.js"; // 👈 IMPORTA EL ARCHIVO

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📂 Servir carpeta "uploads" (donde se guardan imágenes)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🌐 Configurar CORS (para comunicación con Astro)
app.use(
  cors({
    origin: "http://localhost:4321",
    credentials: true, // permite envío de cookies
  })
);

// 🧰 Parseo de requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// 📁 Servir archivos estáticos desde "public"
app.use(express.static("public"));

// 🧩 Conectar base de datos
try {
  await db.authenticate();
  await db.sync(); // no borra tablas, solo sincroniza si faltan
  console.log(chalk.greenBright("✅ Conexión correcta a la base de datos"));
} catch (error) {
  console.log(chalk.bgRed.white("❌ Error al conectar a la base de datos"));
  console.error(chalk.red(error));
}

// 🪵 Middleware de logging unificado
app.use((req, res, next) => {
  const start = Date.now();

  console.log(chalk.yellow(`➡️ ${req.method} ${req.url}`));

  res.on("finish", () => {
    const duration = Date.now() - start;
    const color =
      res.statusCode < 400
        ? chalk.greenBright
        : res.statusCode < 500
        ? chalk.yellowBright
        : chalk.redBright;

    console.log(
      color(
        `📤 [RESPUESTA] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`
      )
    );
  });

  next();
});

app.use((req, res, next) => {
  console.log(
    chalk.magentaBright(`🌐 Request completa: ${req.method} ${req.originalUrl}`)
  );
  next();
});

// 🧭 Rutas principales
app.use("/auth", admiRoutes);
app.use("/productos/precio", precioRoutes); // 🔥 AQUI
app.use("/productos", productoRoutes);
app.use("/categorias", categoriaRoutes); // ✅ NUEVO
app.use("/marcas", marcaRoutes);

// 💥 Middleware global de errores
app.use((err, req, res, next) => {
  console.error(chalk.bgRed.white("💥 Error detectado:"), err.message);
  res.status(500).json({ error: "Error interno del servidor" });
});

// 🚀 Iniciar servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(chalk.cyanBright("🚀 Servidor corriendo en:"));
  console.log(chalk.yellowBright(`👉 http://localhost:${port}`));
});
