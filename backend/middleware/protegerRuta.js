import jwt from "jsonwebtoken";
import Administrador from "../models/Administrador.js";

const protegerRuta = async (req, res, next) => {
  const _token = req.cookies?._token;

  if (!_token) {
    console.warn("⚠️ No se encontró token");
    if (req.accepts("json")) {
      return res.status(401).json({ ok: false, msg: "No autenticado" });
    }
    return res.redirect("/admin/login");
  }

  try {
    const decoded = jwt.verify(
      _token,
      process.env.JWT_SECRET || "secreto_admin",
    );

    const admin = await Administrador.findByPk(decoded.id_administrador, {
      attributes: { exclude: ["hash"] },
    });

    if (!admin || decoded.rol !== "admin") {
      console.warn("⛔ Acceso denegado");
      if (req.accepts("json")) {
        return res.status(403).json({ ok: false, msg: "Acceso denegado" });
      }
      return res.redirect("/admin/login");
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("❌ Token inválido:", error.message);
    res.clearCookie("_token");

    if (req.accepts("json")) {
      return res.status(401).json({ ok: false, msg: "Token inválido" });
    }

    return res.redirect("/admin/login");
  }
};

export default protegerRuta;
