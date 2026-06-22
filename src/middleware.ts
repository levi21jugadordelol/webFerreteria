import type { MiddlewareHandler } from "astro";
import { env } from "./config/env";

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { request, redirect } = context;
  const url = new URL(request.url);

  if (!url.pathname.startsWith("/admin")) {
    return next();
  }

  if (url.pathname === "/admin/login" || url.pathname === "/admin/registro") {
    return next();
  }

  const cookieHeader = request.headers.get("cookie") || "";

  if (!cookieHeader.includes("_token=")) {
    return redirect("/admin/login");
  }

  try {
    const res = await fetch(`${env.API_URL}/auth/validar`, {
      method: "GET",
      headers: {
        cookie: cookieHeader,
      },
    });

    if (!res.ok) {
      return redirect("/admin/login");
    }

    return next();
  } catch {
    return redirect("/admin/login");
  }
};
