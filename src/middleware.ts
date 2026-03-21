import jwt from "jsonwebtoken";
import type { MiddlewareHandler } from "astro";

const SECRET = import.meta.env.JWT_SECRET;

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { request, cookies, redirect, locals } = context;
  const url = new URL(request.url);

  // Solo proteger rutas admin
  if (url.pathname.startsWith("/admin")) {
    // Rutas públicas
    if (url.pathname === "/admin/login" || url.pathname === "/admin/registro") {
      return next();
    }

    const token = cookies.get("_token")?.value;

    // No hay token
    if (!token) {
      return redirect("/admin/login");
    }

    try {
      const decoded = jwt.verify(token, SECRET) as jwt.JwtPayload;

      locals.user = {
        id: decoded.id as number,
        email: decoded.email as string,
        rol: decoded.rol as string,
      };

      return next();
    } catch (error) {
      // Token inválido o expirado
      cookies.delete("_token");

      return redirect("/admin/login");
    }
  }

  return next();
};
