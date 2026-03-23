import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

// 🔧 Config
import { env } from "./config/env.js";
import logger from "./shared/logger/logger.js";

// 📂 Rutas
import admiRoutes from "./modules/admin/admin.routes.js";
import productoRoutes from "./modules/products/producto.routes.js";
import categoriaRoutes from "./modules/categories/category.routes.js";
import marcaRoutes from "./modules/brands/marca.routes.js";
import precioRoutes from "./modules/price/price.routes.js";
import siteSettingsRoutes from "./modules/settings/settings.routes.js";
import heroRoutes from "./modules/heroSlides/hero.routes.js";
import pedidoRouter from "./modules/orders/order.routes.js";
import pagoRouter from "./modules/payments/payment.routes.js";
import productoTabsRoutes from "./modules/productoTab/productoTab.routes.js";
import auditoriaRoutes from "./modules/audit-payments/auditPayment.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import paginaRoutes from "./modules/pages/pagina.routes.js";
import uploadRoutes from "./modules/uploads/upload.routes.js";
import menuRoutes from "./modules/menu/menu.routes.js";

const app = express();

// 📂 Archivos estáticos
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
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

// 🔒 No cache
app.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private",
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// 🪵 Logger
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

// 💥 Error global
app.use((err, req, res, next) => {
  logger.error({
    message: "Unhandled error",
    error: err.message,
  });

  res.status(500).json({
    error: "Error interno del servidor",
  });
});

export default app;
