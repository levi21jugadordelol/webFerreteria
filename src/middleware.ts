import jwt from "jsonwebtoken";
import type { MiddlewareHandler } from "astro";
import type { JwtPayload } from "jsonwebtoken";

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { request, cookies, redirect } = context;
  const url = new URL(request.url);

  if (url.pathname.startsWith("/admin")) {
    console.log("🔎 Ruta protegida:", url.pathname);

    // ✅ Rutas públicas
    if (url.pathname === "/admin/login" || url.pathname === "/admin/registro") {
      console.log("➡️ Acceso permitido:", url.pathname);
      return next();
    }

    const token = cookies.get("_token")?.value;

    if (!token) {
      console.log("⛔ No hay token");
      return redirect("/admin/login");
    }

    console.log("🔐 Token encontrado");
  }

  return next();
};
