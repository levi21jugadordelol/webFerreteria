import jwt from "jsonwebtoken";
import Administrador from "../../modules/admin/admin.model.js";
import { env } from "../../config/env.js";

import {
  AUTH_COOKIE_NAME,
  getClearAuthCookieOptions,
} from "../utils/authCookie.js";

const protegerRuta = async (req, res, next) => {
  const token = req.cookies?.[AUTH_COOKIE_NAME];

  if (!token) {
    return res.status(401).json({
      ok: false,
      message: "No autenticado",
    });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    const admin = await Administrador.findByPk(decoded.id_administrador, {
      attributes: { exclude: ["hash"] },
    });

    if (!admin || admin.estado !== "ACTIVO") {
      res.clearCookie(AUTH_COOKIE_NAME, getClearAuthCookieOptions());

      return res.status(403).json({
        ok: false,
        message: "Acceso denegado",
      });
    }

    req.admin = admin;

    next();
  } catch (error) {
    res.clearCookie(AUTH_COOKIE_NAME, getClearAuthCookieOptions());

    return res.status(401).json({
      ok: false,
      message: "Token inválido o expirado",
    });
  }
};

export default protegerRuta;
