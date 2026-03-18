// 🚀 Dependencias
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import logger from "./src/shared/logger/logger.js";

// 🔧 Config
import { env } from "./src/config/env.js";

// 🗃️ Base de datos
import db from "./src/config/db.js";
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
import uploadRoutes from "./src/modules/uploads/upload.routes.js";
import menuRoutes from "./src/modules/menu/menu.routes.js";

// ⏰ Jobs
import "./src/jobs/pagosCron.js";

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
    origin: env.FRONTEND_URL,
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

// 🪵 Logger simple (LO CAMBIAREMOS DESPUÉS)
app.use((req, res, next) => {
  const start = Date.now();

  logger.info({
    message: "Incoming request",
    method: req.method,
    url: req.originalUrl,
  });

  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.info({
      message: "Request completed",
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
});

// 🧩 RUTAS

app.use("/auth", admiRoutes);

app.use("/productos", productoRoutes);
app.use("/productos/precio", precioRoutes);

app.use("/categorias", categoriaRoutes);
app.use("/marcas", marcaRoutes);

app.use("/api/producto-tabs", productoTabsRoutes);

app.use("/api/site-settings", siteSettingsRoutes);
app.use("/api/pedidos", pedidoRouter);
app.use("/api/pagos", pagoRouter);
app.use("/api/hero", heroRoutes);
app.use("/api/auditoria", auditoriaRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/paginas", paginaRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/uploads", uploadRoutes);

// 💥 Manejo global de errores (luego lo reemplazamos)
app.use((err, req, res, next) => {
  logger.error({
    message: "Unhandled error",
    error: err.message,
  });

  res.status(500).json({
    error: "Error interno del servidor",
  });
});

// 🗃️ Conectar BD
try {
  await db.authenticate();
  await db.sync();

  logger.info("Database connected successfully");
} catch (error) {
  logger.error({
    message: "Database connection failed",
    error: error.message,
  });
}

// 🚀 Iniciar servidor
const port = env.PORT;

app.listen(port, () => {
  logger.info(`Server running at ${env.BACKEND_URL}:${port}`);
});
