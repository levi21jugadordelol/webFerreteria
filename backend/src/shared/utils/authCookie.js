import { env } from "../../config/env.js";

export const AUTH_COOKIE_NAME = "_token";

export function getAuthCookieOptions() {
  const isProd = env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  };
}

export function getClearAuthCookieOptions() {
  const { maxAge, ...options } = getAuthCookieOptions();
  return options;
}
