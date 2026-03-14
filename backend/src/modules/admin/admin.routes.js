import express from "express";
import chalk from "chalk";
import protegerRuta from "../../../middleware/protegerRuta.js";

import {
  formularioLogin,
  autenticar,
  formularioRegistro,
  registrar,
  cerrarSesion,
} from "./admin.controller.js";

const router = express.Router();

/* =========================
   LOGIN
========================= */
router.get("/login", (req, res) => {
  console.log(chalk.blue("📥 GET /auth/login recibido"));
  formularioLogin(req, res);
});

router.post("/login", async (req, res) => {
  console.log(chalk.magenta("📤 POST /auth/login recibido"));
  console.log(chalk.gray("📦 Body recibido:"), req.body);

  try {
    await autenticar(req, res);
  } catch (err) {
    console.error(chalk.bgRed.white("💥 Error en ruta /login:"), err.message);
    res.status(500).json({ msg: "Error interno en /login" });
  }
});

/* =========================
   REGISTRO (solo admin)
========================= */
router.get("/registro", (req, res) => {
  console.log(chalk.blue("📥 GET /auth/registro recibido"));
  formularioRegistro(req, res);
});

router.post("/registro", async (req, res) => {
  console.log(chalk.magenta("📤 POST /auth/registro recibido"));
  console.log(chalk.gray("📦 Body recibido:"), req.body);

  try {
    await registrar(req, res);
  } catch (err) {
    console.error(
      chalk.bgRed.white("💥 Error en ruta /registro:"),
      err.message,
    );
    res.status(500).json({ msg: "Error interno en /registro" });
  }
});

/* =========================
   VALIDAR SESIÓN (🔥 CLAVE)
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
   LOGOUT
========================= */
router.post("/logout", cerrarSesion);

export default router;
