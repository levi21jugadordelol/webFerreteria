import express from "express";
import protegerRuta from "../../shared/middleware/protegerRuta.js";
import logger from "../../shared/logger/logger.js";
import requireRole from "../../shared/middleware/requireRole.js";

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
router.get("/login", (req, res) => {
  logger.info({ message: "GET /auth/login" });
  formularioLogin(req, res);
});

router.post("/login", (req, res, next) => {
  logger.info({
    message: "POST /auth/login",
    email: req.body.correo,
  });

  autenticar(req, res, next);
});

/* =========================
   REGISTRO
========================= */
router.get("/registro", (req, res) => {
  logger.info({ message: "GET /auth/registro" });
  formularioRegistro(req, res);
});

router.post(
  "/registro",
  protegerRuta,
  requireRole("SUPER_ADMIN"), // luego puedes usar "SUPER_ADMIN"
  (req, res, next) => {
    logger.info({
      message: "POST /auth/registro",
      email: req.body.correo,
    });

    registrar(req, res, next);
  },
);

/* =========================
   VALIDAR SESIÓN
========================= */
router.get("/validar", protegerRuta, (req, res) => {
  res.status(200).json({
    ok: true,
    admin: {
      id: req.admin.id_administrador,
      nombre: req.admin.nombre,
      rol: req.admin.rol,
    },
  });
});

/* =========================
   LISTAR ADMINS
========================= */
router.get("/admins", protegerRuta, requireRole("SUPER_ADMIN"), listarAdmins);

/* =========================
   LOGOUT
========================= */
router.post("/logout", cerrarSesion);

export default router;
