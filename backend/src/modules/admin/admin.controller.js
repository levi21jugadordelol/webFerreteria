import { env } from "../../config/env.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";

import {
  autenticarAdmin,
  registrarAdmin,
  listarAdministradores,
} from "./admin.service.js";

import {
  AUTH_COOKIE_NAME,
  getAuthCookieOptions,
  getClearAuthCookieOptions,
} from "../../shared/utils/authCookie.js";

/* 🟢 LOGIN TEST */
export const formularioLogin = (req, res) => {
  return res.success({
    message: "Login del administrador - OK",
  });
};

/* 🟢 AUTENTICAR */
export const autenticar = asyncHandler(async (req, res) => {
  const { token } = await autenticarAdmin(req.body);

  res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());

  return res.success({
    message: "Inicio de sesión exitoso",
  });
});

/* 🟢 REGISTRO TEST */
export const formularioRegistro = (req, res) => {
  return res.success({
    message: "Registro de administrador - OK",
  });
};

/* 🟢 REGISTRAR */
export const registrar = asyncHandler(async (req, res) => {
  await registrarAdmin(req.body);

  return res.success({
    status: 201,
    message: "Administrador registrado correctamente",
  });
});

/* 🟢 LISTAR */
export const listarAdmins = asyncHandler(async (req, res) => {
  const admins = await listarAdministradores();

  return res.success({
    data: admins,
  });
});

/* 🟢 LOGOUT */
export const cerrarSesion = (req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME, getClearAuthCookieOptions());

  return res.success({
    message: "Sesión cerrada correctamente",
  });
};
