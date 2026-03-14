import express from "express";
import chalk from "chalk";

import protegerRuta from "../middleware/protegerRuta.js";

import {
  obtenerMenu,
  listarMenuAdmin,
  crearMenu,
  actualizarMenu,
  eliminarMenu,
} from "../controllers/menuController.js";

const router = express.Router();

router.use((req, res, next) => {
  console.log(chalk.bgCyan.black(`📥 [ROUTE] /menu ${req.method} ${req.url}`));
  next();
});

/* -----------------------------
   PUBLICO
----------------------------- */

router.get("/", obtenerMenu);

/* -----------------------------
   ADMIN
----------------------------- */

router.get("/admin/lista", protegerRuta, listarMenuAdmin);

router.post("/admin", protegerRuta, crearMenu);

router.put("/admin/:id", protegerRuta, actualizarMenu);

router.delete("/admin/:id", protegerRuta, eliminarMenu);

export default router;
