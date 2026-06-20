import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import helmet from "helmet";

// 🔧 Config
import { env } from "./config/env.js";
import logger from "./shared/logger/logger.js";

// 🧩 Middlewares
import responseHandler from "./shared/middleware/responseHandler.js";
import errorHandler from "./shared/middleware/errorHandler.js";

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

import { apiLimiter } from "./shared/middleware/rateLimiters.js";

const app = express();

// 🔒 OCULTAR TECNOLOGÍA (seguridad)
app.disable("x-powered-by");

const isProd = env.NODE_ENV === "production";

if (isProd) {
  app.set("trust proxy", 1);
}

// 📂 Archivos estáticos
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(express.static("public"));

// 🌐 CORS (BIEN CONFIGURADO)
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

// 🔐 HEADERS DE SEGURIDAD (VERSIÓN PRO)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },

    // 🛡️ CSP (muy importante)
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'", env.FRONTEND_URL],
      },
    },

    // 🔒 Evita fuga de información en headers
    referrerPolicy: { policy: "no-referrer" },
  }),
);

// 🔐 HSTS (solo producción)
if (isProd) {
  app.use(
    helmet.hsts({
      maxAge: 31536000, // 1 año
      includeSubDomains: true,
      preload: true,
    }),
  );
}

// 🧰 Parseo
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// 🪵 LOGGER
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

// 🔒 NO CACHE (BIEN 👍)
app.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private",
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// ✅ Response handler
app.use(responseHandler);

app.use("/api/v1", apiLimiter);

// 🧩 RUTAS
// prefijo único para toda la API
app.use(
  "/api/v1",
  ((router) => {
    router.use("/auth", admiRoutes);

    router.use("/productos", productoRoutes);
    router.use("/productos/precio", precioRoutes);

    router.use("/categorias", categoriaRoutes);
    router.use("/marcas", marcaRoutes);

    router.use("/producto-tabs", productoTabsRoutes);
    router.use("/site-settings", siteSettingsRoutes);
    router.use("/pedidos", pedidoRouter);
    router.use("/pagos", pagoRouter);
    router.use("/hero", heroRoutes);
    router.use("/auditoria", auditoriaRoutes);
    router.use("/dashboard", dashboardRoutes);
    router.use("/paginas", paginaRoutes);
    router.use("/menu", menuRoutes);
    router.use("/uploads", uploadRoutes);

    return router;
  })(express.Router()),
);

// 🪵 ERROR LOGGER
app.use((err, req, res, next) => {
  logger.error({
    message: "Unhandled error",
    error: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  next(err);
});

// 💥 ERROR HANDLER FINAL
app.use(errorHandler);

export default app;
