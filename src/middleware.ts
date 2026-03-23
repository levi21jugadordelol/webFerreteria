import jwt from "jsonwebtoken";
import type { MiddlewareHandler } from "astro";

import { env } from "./config/env";

const SECRET = env.JWT_SECRET;

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { request, cookies, redirect, locals } = context;
  const url = new URL(request.url);

  if (url.pathname.startsWith("/admin")) {
    if (url.pathname === "/admin/login" || url.pathname === "/admin/registro") {
      return next();
    }

    const token = cookies.get("_token")?.value;

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
    } catch {
      cookies.delete("_token");
      return redirect("/admin/login");
    }
  }

  return next();
};
