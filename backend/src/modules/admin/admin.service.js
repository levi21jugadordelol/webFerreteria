import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import Administrador from "./admin.model.js";
import AppError from "../../shared/utils/AppError.js";
import logger from "../../shared/logger/logger.js";

/* =========================
   AUTENTICAR
========================= */
export const autenticarAdmin = async ({ correo, password }) => {
  const correoNormalizado = correo.trim().toLowerCase();

  const admin = await Administrador.findOne({
    where: { correo: correoNormalizado },
    order: [["id_administrador", "DESC"]],
  });

  if (!admin) {
    logger.warn({
      message: "Admin login failed",
      reason: "ADMIN_NOT_FOUND",
    });

    throw new AppError("Credenciales inválidas", 401);
  }

  if (admin.estado !== "ACTIVO") {
    logger.warn({
      message: "Admin login blocked",
      adminId: admin.id_administrador,
      reason: "ADMIN_INACTIVE",
    });

    throw new AppError("Administrador desactivado", 403);
  }

  const esValido = await bcrypt.compare(password, admin.hash);

  if (!esValido) {
    logger.warn({
      message: "Admin login failed",
      adminId: admin.id_administrador,
      reason: "INVALID_PASSWORD",
    });

    throw new AppError("Credenciales inválidas", 401);
  }

  logger.info({
    message: "Admin login success",
    adminId: admin.id_administrador,
    rol: admin.rol,
  });

  const token = jwt.sign(
    {
      id_administrador: admin.id_administrador,
      nombre: admin.nombre,
      rol: admin.rol,
    },
    env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  return { token };
};

/* =========================
   REGISTRAR
========================= */
export const registrarAdmin = async ({ nombre, correo, password }) => {
  const correoNormalizado = correo.trim().toLowerCase();
  const nombreNormalizado = nombre.trim();

  const existeAdmin = await Administrador.findOne({
    where: { correo: correoNormalizado },
  });

  if (existeAdmin) {
    throw new AppError("El correo ya está registrado", 400);
  }

  const hash = await bcrypt.hash(password, 10);

  const nuevoAdmin = await Administrador.create({
    nombre: nombreNormalizado,
    correo: correoNormalizado,
    hash,
  });

  logger.info({
    message: "Admin created",
    adminId: nuevoAdmin.id_administrador,
  });

  return true;
};

/* =========================
   LISTAR ADMINS
========================= */
export const listarAdministradores = async () => {
  return await Administrador.scope("sinHash").findAll({
    order: [["id_administrador", "DESC"]],
  });
};
