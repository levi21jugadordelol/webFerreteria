import jwt from "jsonwebtoken";
import type { MiddlewareHandler } from "astro";
import { env } from "./config/env";

const SECRET = env.JWT_SECRET;

/* DEBUG TEMPORAL */
const g = globalThis as any;

if (!g.__FETCH_DEBUG_PATCHED__) {
  g.__FETCH_DEBUG_PATCHED__ = true;

  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await originalFetch(input, init);

    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("text/html")) {
      const body = await response.clone().text();

      console.error("💣 FETCH DEVOLVIÓ HTML");
      console.error("URL:", url);
      console.error("STATUS:", response.status);
      console.error("CONTENT-TYPE:", contentType);
      console.error("BODY:", body.slice(0, 300));
      console.error("STACK:", new Error().stack);
    }

    return response;
  };
}

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { request, cookies, redirect, locals } = context;
  const url = new URL(request.url);

  const cookie = cookies.get("_token");

  if (import.meta.env.DEV) {
    console.log("🍪 COOKIE:", cookie);
  }

  if (url.pathname.startsWith("/admin")) {
    if (url.pathname === "/admin/login" || url.pathname === "/admin/registro") {
      return next();
    }

    const token = cookie?.value;

    if (!token) {
      if (import.meta.env.DEV) {
        console.log("❌ No hay token");
      }

      return redirect("/admin/login");
    }

    if (import.meta.env.DEV) {
      console.log("SECRET ASTRO EXISTS:", Boolean(SECRET));
      console.log("SECRET ASTRO LENGTH:", SECRET?.length);
      console.log("TOKEN EXISTS:", Boolean(token));
    }

    try {
      const decoded = jwt.verify(token, SECRET) as jwt.JwtPayload;

      locals.user = {
        id: decoded.id_administrador,
        email: decoded.nombre,
        rol: decoded.rol,
      };

      if (import.meta.env.DEV) {
        console.log("✅ Usuario autenticado:", locals.user);
      }

      return next();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.log("❌ JWT ERROR:", error);
        console.log("SECRET ASTRO EXISTS:", Boolean(SECRET));
        console.log("SECRET ASTRO LENGTH:", SECRET?.length);
        console.log("TOKEN EXISTS:", Boolean(token));
        console.log("TOKEN LENGTH:", token?.length);
      }

      cookies.delete("_token");
      return redirect("/admin/login");
    }
  }

  return next();
};
