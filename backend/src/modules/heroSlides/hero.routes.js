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

const router = express.Router();

/* PUBLICO */
router.get("/", getHeroSlides);
router.get("/:id", getHeroById);

/* ADMIN */
router.post("/", protegerRuta, uploadHero.single("imagen"), createHeroSlide);

router.put("/orden", protegerRuta, updateHeroOrden);

router.put("/:id", protegerRuta, uploadHero.single("imagen"), updateHeroSlide);
router.delete("/:id", protegerRuta, deleteHeroSlide);

export default router;
