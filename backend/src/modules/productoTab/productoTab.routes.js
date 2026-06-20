import express from "express";

import {
  listarTabs,
  crearTab,
  actualizarTab,
  toggleTab,
  eliminarTab,
} from "./productoTab.controller.js";

import protegerRuta from "../../shared/middleware/protegerRuta.js";

import {
  validarCrearTab,
  validarActualizarTab,
  validarIdTab,
} from "./productoTab.validator.js";

const router = express.Router();

/* ============================
   LISTAR TABS (PUBLICO)
============================ */
router.get("/", listarTabs);

/* ============================
   CREAR TAB (ADMIN)
============================ */
router.post("/", protegerRuta, validarCrearTab, crearTab);

/* ============================
   ACTUALIZAR TAB (ADMIN)
============================ */
router.put(
  "/:id",
  protegerRuta,
  validarIdTab,
  validarActualizarTab,
  actualizarTab,
);

/* ============================
   ACTIVAR / DESACTIVAR (ADMIN)
============================ */
router.patch("/:id/toggle", protegerRuta, validarIdTab, toggleTab);

/* ============================
   ELIMINAR TAB (ADMIN)
============================ */
router.delete("/:id", protegerRuta, validarIdTab, eliminarTab);

export default router;
