import jwt from "jsonwebtoken";
import Administrador from "../models/Administrador.js";

const protegerRuta = async (req, res, next) => {
  // 1️⃣ Verificar si hay cookie con el token
  const _token = req.cookies?._token;

  if (!_token) {
    console.warn("⚠️ No se encontró token en las cookies");
    return res.redirect("/login");
  }

  try {
    // 2️⃣ Verificar validez del token
    const decoded = jwt.verify(
      _token,
      process.env.JWT_SECRET || "secreto_admin"
    );

    // 3️⃣ Buscar el administrador en la base de datos
    const admin = await Administrador.findByPk(decoded.id, {
      attributes: { exclude: ["hash"] }, // para no exponer el hash
    });

    // 4️⃣ Validar existencia
    if (!admin) {
      console.warn("⚠️ Token válido pero admin no existe");
      return res.redirect("/login");
    }

    // 5️⃣ Guardar datos del admin en el request
    req.admin = admin;

    // 6️⃣ Pasar al siguiente middleware / controlador
    next();
  } catch (error) {
    console.error("Error en protegerRuta:", error.message);
    // Si hay error, limpiar cookie y redirigir
    res.clearCookie("_token");
    return res.redirect("/login");
  }
};

export default protegerRuta;
