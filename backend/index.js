// 📦 Variables de entorno
import dotenv from "dotenv";
dotenv.config();

// 🚀 Dependencias
import express from "express";
import chalk from "chalk";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// 🗃️ Base de datos
import db from "./config/db.js";
import "./models/index.js";

// 📂 Rutas
import admiRoutes from "./src/modules/admin/admin.routes.js";

import productoRoutes from "./src/modules/products/producto.routes.js";

import categoriaRoutes from "./src/modules/categories/category.routes.js";

import marcaRoutes from "./src/modules/brands/marca.routes.js";

import precioRoutes from "./src/modules/price/price.routes.js";

import siteSettingsRoutes from "./src/modules/settings/settings.routes.js";
import heroRoutes from "./src/modules/heroSlides/hero.routes.js";
import pedidoRouter from "./src/modules/orders/order.routes.js";
import pagoRouter from "./src/modules/payments/payment.routes.js";

import productoTabsRoutes from "./src/modules/productoTab/productoTab.routes.js";

import auditoriaRoutes from "./src/modules/audit-payments/auditPayment.routes.js";
import dashboardRoutes from "./src/modules/dashboard/dashboard.routes.js";

import paginaRoutes from "./src/modules/pages/pagina.routes.js";

import "./helpers/pagosCron.js";

import uploadRoutes from "./src/modules/uploads/upload.routes.js";

import menuRoutes from "./src/modules/menu/menu.routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📂 Servir uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// 📂 Archivos públicos
app.use(express.static("public"));

// 🌐 CORS
app.use(
  cors({
    origin: "http://localhost:4321",
    credentials: true,
  }),
);

// 🧰 Parseo
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// 🔒 DESACTIVAR CACHE
app.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private",
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// 🪵 Logger simple
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
        `📤 ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`,
      ),
    );
  });

  next();
});

// 🧩 RUTAS

app.use("/auth", admiRoutes);

app.use("/productos", productoRoutes);
app.use("/productos/precio", precioRoutes);

app.use("/categorias", categoriaRoutes);
app.use("/marcas", marcaRoutes);

app.use("/producto-tabs", productoTabsRoutes);

app.use("/api/site-settings", siteSettingsRoutes);
app.use("/api/pedidos", pedidoRouter);
app.use("/api/pagos", pagoRouter);
app.use("/api/hero", heroRoutes);
app.use("/api/auditoria", auditoriaRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/paginas", paginaRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/uploads", uploadRoutes);

// 💥 Manejo global de errores
app.use((err, req, res, next) => {
  console.error(chalk.bgRed.white("💥 Error detectado:"), err.message);

  res.status(500).json({
    error: "Error interno del servidor",
  });
});

// 🗃️ Conectar BD
try {
  await db.authenticate();
  await db.sync();

  console.log(chalk.greenBright("✅ Conexión correcta a la base de datos"));
} catch (error) {
  console.log(chalk.bgRed.white("❌ Error al conectar a la base de datos"));
  console.error(chalk.red(error));
}

// 🚀 Iniciar servidor
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(chalk.cyanBright("🚀 Servidor corriendo en:"));
  console.log(chalk.yellowBright(`👉 http://localhost:${port}`));
});
