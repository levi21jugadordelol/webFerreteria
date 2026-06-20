import express from "express";
import {
  getHeroSlides,
  getHeroById,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  updateHeroOrden,
} from "./hero.controller.js";

import protegerRuta from "../../shared/middleware/protegerRuta.js";
import uploadHero from "../../shared/middleware/uploadHero.js";

import {
  validarCrearHero,
  validarActualizarHero,
  validarIdHero,
  validarOrdenHero,
} from "./hero.validator.js";

import { validateResult } from "../../shared/middleware/validateResult.js";

const router = express.Router();

/* =========================
   🟢 PUBLICO
========================= */
router.get("/", getHeroSlides);

router.get("/:id", validarIdHero, validateResult, getHeroById);

/* =========================
   🔒 ADMIN
========================= */
router.post(
  "/",
  protegerRuta,
  uploadHero,
  validarCrearHero,
  validateResult,
  createHeroSlide,
);

router.put(
  "/orden",
  protegerRuta,
  validarOrdenHero,
  validateResult,
  updateHeroOrden,
);

router.put(
  "/:id",
  protegerRuta,
  uploadHero,
  validarIdHero,
  validarActualizarHero,
  validateResult,
  updateHeroSlide,
);

router.delete(
  "/:id",
  protegerRuta,
  validarIdHero,
  validateResult,
  deleteHeroSlide,
);

export default router;
