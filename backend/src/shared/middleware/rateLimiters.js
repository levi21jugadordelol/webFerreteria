// src/shared/middleware/rateLimiters.js
import rateLimit from "express-rate-limit";

const createLimiter = ({ windowMs, max, message }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      ok: false,
      message,
    },
  });

export const loginLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Demasiados intentos de login. Intenta nuevamente en 15 minutos.",
});

export const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Demasiadas solicitudes de autenticación. Intenta más tarde.",
});

export const apiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: "Demasiadas solicitudes. Intenta más tarde.",
});

export const uploadLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Demasiadas subidas de archivos. Intenta más tarde.",
});

export const orderLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "Demasiados pedidos. Intenta más tarde.",
});
