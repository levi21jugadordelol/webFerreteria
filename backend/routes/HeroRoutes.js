import express from "express";
import chalk from "chalk";
import {
  getHeroSlides,
  getHeroById,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  updateHeroOrden,
} from "../controllers/heroControllers.js";

import protegerRuta from "../middleware/protegerRuta.js";
import uploadHero from "../middleware/uploadHero.js";

const router = express.Router();

/* LOG */
router.use((req, res, next) => {
  console.log(chalk.bgBlue.white(`📥 [ROUTE] /hero${req.originalUrl}`));
  next();
});

/* PUBLICO */
router.get("/", getHeroSlides);
router.get("/:id", getHeroById);

/* ADMIN */
router.post("/", protegerRuta, uploadHero.single("imagen"), createHeroSlide);

router.put("/orden", protegerRuta, updateHeroOrden);

router.put("/:id", protegerRuta, uploadHero.single("imagen"), updateHeroSlide);
router.delete("/:id", protegerRuta, deleteHeroSlide);

export default router;
