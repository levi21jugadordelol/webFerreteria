import express from "express";
import chalk from "chalk";

import protegerRuta from "../middleware/protegerRuta.js";

import {
  crearPagina,
  listarPaginasAdmin,
  obtenerPagina,
  obtenerPaginaAdmin,
  actualizarPagina,
  eliminarPagina,
  listarPaginas,
} from "../controllers/paginaController.js";

const router = express.Router();

router.use((req, res, next) => {
  console.log(
    chalk.bgMagenta.white(`📥 [ROUTE] /paginas ${req.method} ${req.url}`),
  );
  next();
});

/* -----------------------------
   ADMIN (PROTEGIDO)
----------------------------- */

router.get("/", listarPaginas);

router.post("/admin", protegerRuta, crearPagina);

router.get("/admin/lista", protegerRuta, listarPaginasAdmin);

router.get("/admin/:id", protegerRuta, obtenerPaginaAdmin);

router.put("/admin/:id", protegerRuta, actualizarPagina);

router.delete("/admin/:id", protegerRuta, eliminarPagina);

/* -----------------------------
   PUBLICO
----------------------------- */

router.get("/:slug", obtenerPagina);

export default router;
