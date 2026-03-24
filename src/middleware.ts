import jwt from "jsonwebtoken";
import type { MiddlewareHandler } from "astro";
import { env } from "./config/env";

const SECRET = env.JWT_SECRET;

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
      }

      cookies.delete("_token");
      return redirect("/admin/login");
    }
  }

  return next();
};
