import logger from "../logger/logger.js";

const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;

  // 🔥 Logging estructurado
  logger.error({
    message: err.message,
    status,
    stack: err.stack,
    type: err.type || "GENERAL",
  });

  // 🔥 Respuesta base
  const response = {
    ok: false,
    message:
      status >= 500 && process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message || "Internal Server Error",
  };

  // 🔥 Metadata opcional (solo si existe)
  if (err.producto_id) response.producto_id = err.producto_id;
  if (err.stock_disponible !== undefined)
    response.stock_disponible = err.stock_disponible;
  if (err.type) response.type = err.type;

  return res.status(status).json(response);
};

export default errorHandler;
