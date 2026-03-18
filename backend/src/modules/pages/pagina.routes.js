import express from "express";
import protegerRuta from "../../shared/middleware/protegerRuta.js";

import {
  crearPagina,
  listarPaginasAdmin,
  obtenerPagina,
  obtenerPaginaAdmin,
  actualizarPagina,
  eliminarPagina,
  listarPaginas,
} from "./pagina.controller.js";

const router = express.Router();

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
