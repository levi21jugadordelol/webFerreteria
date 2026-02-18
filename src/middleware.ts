import jwt from "jsonwebtoken";
import type { MiddlewareHandler } from "astro";
import type { JwtPayload } from "jsonwebtoken";

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { request, cookies, redirect } = context;
  const url = new URL(request.url);

  // Solo proteger rutas /admin
  if (url.pathname.startsWith("/admin")) {
    console.log("🔎 Ruta protegida:", url.pathname);

    // Permitir login
    if (url.pathname === "/admin/login") {
      console.log("➡️ Acceso permitido a login");
      return next();
    }

    const token = cookies.get("_token")?.value;

    if (!token) {
      console.log("⛔ No hay token. Redirigiendo...");
      return redirect("/admin/login");
    }

    console.log("🔐 Token encontrado");

    try {
      const decoded = jwt.verify(
        token,
        import.meta.env.JWT_SECRET,
      ) as JwtPayload & { nombre: string };

      console.log("✅ Token válido para:", decoded.nombre);
    } catch (error: any) {
      console.log("❌ Token inválido:", error.message);
      return redirect("/admin/login");
    }
  }

  return next();
};
