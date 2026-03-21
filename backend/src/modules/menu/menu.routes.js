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

const router = express.Router();

/* -----------------------------
   PUBLICO
----------------------------- */

router.get("/", obtenerMenu);

/* -----------------------------
   ADMIN
----------------------------- */

router.get("/admin/lista", protegerRuta, listarMenuAdmin);

router.get("/admin/:id", protegerRuta, obtenerMenuPorId); // ✅ NUEVO

router.post("/admin", protegerRuta, crearMenu);

router.put("/admin/orden", protegerRuta, actualizarOrdenMenu);

router.put("/admin/:id", protegerRuta, actualizarMenu);

router.delete("/admin/:id", protegerRuta, eliminarMenu);

export default router;
