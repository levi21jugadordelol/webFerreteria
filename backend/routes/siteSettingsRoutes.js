import express from "express";
import chalk from "chalk";

import {
  getSiteSettings,
  updateSiteSettings,
} from "../controllers/siteSettingsController.js";

import protegerRuta from "../middleware/protegerRuta.js";

const router = express.Router();

/* ──────────────────────────────
   🧠 LOG DE RUTA
────────────────────────────── */

router.use((req, res, next) => {
  console.log(chalk.bgMagenta.white(`📥 [ROUTE] /api/site-settings${req.url}`));
  next();
});

/* ──────────────────────────────
   🟢 GET PUBLICO
   GET /api/site-settings
────────────────────────────── */

router.get("/", getSiteSettings);

/* ──────────────────────────────
   🔒 ADMIN
   PUT /api/site-settings
────────────────────────────── */

router.put("/", protegerRuta, updateSiteSettings);

export default router;
