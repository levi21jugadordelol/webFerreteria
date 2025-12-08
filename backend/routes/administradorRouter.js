import express from "express";
import chalk from "chalk";
import {
  formularioLogin,
  autenticar,
  formularioRegistro,
  registrar,
} from "../controllers/administradorController.js";

const router = express.Router();

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

router.get("/registro", (req, res) => {
  console.log(chalk.blue("📥 GET /auth/registro recibido"));
  formularioRegistro(req, res);
});

router.post("/registro", (req, res) => {
  console.log(chalk.magenta("📤 POST /auth/registro recibido"));
  console.log(chalk.gray("📦 Body recibido:"), req.body);
  registrar(req, res);
});

export default router;
