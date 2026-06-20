import express from "express";
import protegerRuta from "../../shared/middleware/protegerRuta.js";

import {
  obtenerMenu,
  listarMenuAdmin,
  crearMenu,
  actualizarMenu,
  eliminarMenu,
  actualizarOrdenMenu,
  obtenerMenuPorId,
} from "../../modules/menu/menu.controller.js";

import {
  validarIdMenu,
  validarCrearMenu,
  validarActualizarMenu,
  validarOrdenMenu,
} from "../../modules/menu/menu.validator.js";

import { validateResult } from "../../shared/middleware/validateResult.js";

const router = express.Router();

/* -----------------------------
   PUBLICO
----------------------------- */
router.get("/", obtenerMenu);

/* -----------------------------
   ADMIN
----------------------------- */
router.get("/admin/lista", protegerRuta, listarMenuAdmin);

router.get(
  "/admin/:id",
  protegerRuta,
  validarIdMenu,
  validateResult,
  obtenerMenuPorId,
);

router.post(
  "/admin",
  protegerRuta,
  validarCrearMenu,
  validateResult,
  crearMenu,
);

router.put(
  "/admin/orden",
  protegerRuta,
  validarOrdenMenu,
  validateResult,
  actualizarOrdenMenu,
);

router.put(
  "/admin/:id",
  protegerRuta,
  validarIdMenu,
  validarActualizarMenu,
  validateResult,
  actualizarMenu,
);

router.delete(
  "/admin/:id",
  protegerRuta,
  validarIdMenu,
  validateResult,
  eliminarMenu,
);

export default router;
