import express from "express";

import protegerRuta from "../../shared/middleware/protegerRuta.js";
import requireRole from "../../shared/middleware/requireRole.js";
import { validateResult } from "../../shared/middleware/validateResult.js";

import { validarLogin, validarRegistro } from "./admin.validator.js";

import {
  loginLimiter,
  authLimiter,
} from "../../shared/middleware/rateLimiters.js";

import {
  formularioLogin,
  autenticar,
  formularioRegistro,
  registrar,
  listarAdmins,
  cerrarSesion,
} from "./admin.controller.js";

const router = express.Router();

/* =========================
   LOGIN
========================= */
router.get("/login", authLimiter, formularioLogin);

router.post("/login", loginLimiter, validarLogin, validateResult, autenticar);

/* =========================
   REGISTRO
========================= */
router.get("/registro", authLimiter, formularioRegistro);

router.post(
  "/registro",
  authLimiter,
  protegerRuta,
  requireRole("SUPER_ADMIN"),
  validarRegistro,
  validateResult,
  registrar,
);

/* =========================
   VALIDAR SESIÓN
========================= */
router.get("/validar", authLimiter, protegerRuta, (req, res) => {
  return res.success({
    data: {
      id: req.admin.id_administrador,
      nombre: req.admin.nombre,
      rol: req.admin.rol,
    },
  });
});

/* =========================
   LISTAR ADMINS
========================= */
router.get(
  "/admins",
  authLimiter,
  protegerRuta,
  requireRole("SUPER_ADMIN"),
  listarAdmins,
);

/* =========================
   LOGOUT
========================= */
router.post("/logout", authLimiter, protegerRuta, cerrarSesion);

export default router;
