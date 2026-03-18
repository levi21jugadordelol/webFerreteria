import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import Administrador from "./admin.model.js";
import logger from "../../shared/logger/logger.js";

// 🟢 Endpoint de prueba (verifica conexión del login)
const formularioLogin = (req, res) => {
  res.json({ mensaje: "Login del administrador - OK" });
};

// 🟢 Autenticar administrador
const autenticar = async (req, res) => {
  logger.info({
    message: "Entering autenticar",
    body: req.body,
  });

  try {
    await check("correo").isEmail().run(req);
    await check("password").notEmpty().run(req);

    const resultado = validationResult(req);
    if (!resultado.isEmpty()) {
      return res.status(400).json({ errores: resultado.array() });
    }

    const { correo, password } = req.body;

    const admin = await Administrador.findOne({
      where: { correo },
      order: [["id_administrador", "DESC"]], // 🔥 trae el último
    });

    if (!admin) {
      return res.status(404).json({ msg: "El administrador no existe" });
    }

    logger.debug({
      message: "Hash from DB",
      hash: admin.hash,
    });

    // 🔥 LIMPIAMOS password igual que en registro
    const cleanPassword = password.trim();

    const esValido = await bcrypt.compare(cleanPassword, admin.hash);

    logger.debug({
      message: "Password comparison result",
      valid: esValido,
    });

    if (!esValido) {
      return res.status(401).json({ msg: "La contraseña es incorrecta" });
    }

    const token = jwt.sign(
      {
        id_administrador: admin.id_administrador,
        nombre: admin.nombre,
        rol: admin.rol,
      },
      env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return res.json({
      msg: "Inicio de sesión exitoso",
    });
  } catch (error) {
    logger.error({
      message: "Error in autenticar",
      error: error.message,
    });
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

// 🟢 Endpoint de prueba (formulario de registro)
const formularioRegistro = (req, res) => {
  res.json({ mensaje: "Registro de administrador - OK" });
};

// 🟢 Registrar administrador
const registrar = async (req, res) => {
  logger.info({
    message: "Entering registrar",
    body: req.body,
  });

  try {
    await check("nombre").notEmpty().run(req);
    await check("correo").isEmail().run(req);
    await check("password").isLength({ min: 6 }).run(req);

    const resultado = validationResult(req);
    if (!resultado.isEmpty()) {
      return res.status(400).json({ errores: resultado.array() });
    }

    const { nombre, correo, password } = req.body;

    // 🔥 ESTE ES EL LOG CLAVE
    logger.debug({
      message: "Password received for hashing",
    });

    const existeAdmin = await Administrador.findOne({ where: { correo } });

    if (existeAdmin) {
      return res.status(400).json({ msg: "El correo ya está registrado" });
    }

    // 🔥 LIMPIAMOS el password (extra seguridad)
    const cleanPassword = password.trim();

    const hash = await bcrypt.hash(cleanPassword, 10);

    logger.debug({
      message: "Password hashed successfully",
    });

    await Administrador.create({
      nombre,
      correo,
      hash,
    });

    return res.status(201).json({
      msg: "Administrador registrado correctamente",
    });
  } catch (error) {
    logger.error({
      message: "Error in registrar",
      error: error.message,
    });
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

const listarAdmins = async (req, res) => {
  try {
    const admins = await Administrador.findAll({
      attributes: ["id_administrador", "nombre", "correo", "hash"],
    });

    return res.json(admins);
  } catch (error) {
    logger.error({
      message: "Error listing admins",
      error: error.message,
    });
    return res.status(500).json({ msg: "Error al obtener administradores" });
  }
};

// 🟢 Cerrar sesión
// 🟢 Cerrar sesión
const cerrarSesion = (req, res) => {
  res.clearCookie("_token", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json({
    ok: true,
    msg: "Sesión cerrada correctamente",
  });
};

export {
  formularioLogin,
  autenticar,
  formularioRegistro,
  registrar,
  listarAdmins,
  cerrarSesion,
};
