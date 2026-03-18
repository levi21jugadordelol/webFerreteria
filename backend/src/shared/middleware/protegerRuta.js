import jwt from "jsonwebtoken";
import Administrador from "../../modules/admin/admin.model.js";
import { env } from "../../config/env.js";

const protegerRuta = async (req, res, next) => {
  const token = req.cookies?._token;

  /* ───────── TOKEN EXISTE ───────── */

  if (!token) {
    console.warn("⚠️ No se encontró token");

    if (req.accepts("json")) {
      return res.status(401).json({
        ok: false,
        msg: "No autenticado",
      });
    }

    return res.redirect("/admin/login");
  }

  try {
    /* ───────── VERIFICAR TOKEN ───────── */

    const decoded = jwt.verify(token, env.JWT_SECRET);

    /* ───────── BUSCAR ADMIN ───────── */

    const admin = await Administrador.findByPk(decoded.id_administrador, {
      attributes: { exclude: ["hash"] },
    });

    if (!admin) {
      console.warn("⛔ Admin no encontrado");

      return res.status(403).json({
        ok: false,
        msg: "Acceso denegado",
      });
    }

    /* ───────── VALIDAR ROL ───────── */

    if (decoded.rol !== "admin") {
      console.warn("⛔ Rol inválido");

      return res.status(403).json({
        ok: false,
        msg: "Acceso denegado",
      });
    }

    /* ───────── PASAR ADMIN ───────── */

    req.admin = admin;

    next();
  } catch (error) {
    console.error("❌ Token inválido:", error.message);

    res.clearCookie("_token");

    if (req.accepts("json")) {
      return res.status(401).json({
        ok: false,
        msg: "Token inválido",
      });
    }

    return res.redirect("/admin/login");
  }
};

export default protegerRuta;
