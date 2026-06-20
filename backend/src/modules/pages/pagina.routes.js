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

import {
  validarCrearPagina,
  validarActualizarPagina,
  validarIdPagina,
  validarBodyNoVacio,
  validarSlugPagina,
} from "./pagina.validator.js";

const router = express.Router();

/* -----------------------------
   PUBLICO
----------------------------- */

router.get("/", listarPaginas);
router.get("/:slug", validarSlugPagina, obtenerPagina);

/* -----------------------------
   ADMIN (PROTEGIDO)
----------------------------- */

router.post("/admin", protegerRuta, validarCrearPagina, crearPagina);

router.get("/admin/lista", protegerRuta, listarPaginasAdmin);

router.get("/admin/:id", protegerRuta, validarIdPagina, obtenerPaginaAdmin);

router.put(
  "/admin/:id",
  protegerRuta,
  validarIdPagina,
  validarBodyNoVacio,
  validarActualizarPagina,
  actualizarPagina,
);

router.delete("/admin/:id", protegerRuta, validarIdPagina, eliminarPagina);

export default router;
