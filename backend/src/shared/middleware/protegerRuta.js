import jwt from "jsonwebtoken";
import Administrador from "../../modules/admin/admin.model.js";
import { env } from "../../config/env.js";

const protegerRuta = async (req, res, next) => {
  const token = req.cookies?._token;

  if (!token) {
    if (req.accepts("json")) {
      return res.status(401).json({ ok: false, msg: "No autenticado" });
    }
    return res.redirect("/admin/login");
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    const admin = await Administrador.findByPk(decoded.id_administrador, {
      attributes: { exclude: ["hash"] },
    });

    if (!admin) {
      return res.status(403).json({
        ok: false,
        msg: "Acceso denegado",
      });
    }

    req.admin = admin;

    next();
  } catch (error) {
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
