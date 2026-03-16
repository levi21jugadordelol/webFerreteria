import express from "express";

import {
  listarTabs,
  crearTab,
  actualizarTab,
  toggleTab,
  eliminarTab,
} from "./productoTab.controller.js";

import protegerRuta from "../../shared/middleware/protegerRuta.js";

const router = express.Router();

/* ============================
   LISTAR TABS
============================ */
router.get("/", listarTabs);

/* ============================
   CREAR TAB
============================ */
router.post("/", protegerRuta, crearTab);

/* ============================
   ACTUALIZAR TAB
============================ */
router.put("/:id", protegerRuta, actualizarTab);

/* ============================
   ACTIVAR / DESACTIVAR
============================ */
router.patch("/:id/toggle", protegerRuta, toggleTab);

/* ============================
   ELIMINAR TAB
============================ */
router.delete("/:id", protegerRuta, eliminarTab);

export default router;
