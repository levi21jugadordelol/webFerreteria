import crypto from "crypto";
import { env } from "../../config/env.js";

export const CSRF_COOKIE_NAME = "_csrf";
export const CSRF_HEADER_NAME = "x-csrf-token";

export function createCsrfToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function getCsrfCookieOptions() {
  const isProd = env.NODE_ENV === "production";

  return {
    httpOnly: false,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  };
}

export function getClearCsrfCookieOptions() {
  const { maxAge, ...options } = getCsrfCookieOptions();
  return options;
}

export function csrfProtection(req, res, next) {
  const method = req.method.toUpperCase();

  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    return next();
  }

  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
  const headerToken = req.headers[CSRF_HEADER_NAME];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({
      ok: false,
      msg: "CSRF token inválido",
    });
  }

  next();
}
