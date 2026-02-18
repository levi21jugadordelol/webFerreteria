// routes/siteSettingsRoutes.js
import express from "express";
import chalk from "chalk";
import {
  getSiteSettings,
  updateSiteSettings, // lo dejamos listo aunque no lo uses aún
} from "../controllers/siteSettingsController.js";
import protegerRuta from "../middleware/protegerRuta.js";

const router = express.Router();

/* ──────────────────────────────
   🧠 LOG DE RUTA
────────────────────────────── */
router.use((req, res, next) => {
  console.log(chalk.bgMagenta.white(`📥 [ROUTE] /site-settings${req.url}`));
  next();
});

/* ──────────────────────────────
   🟢 PÚBLICA (PMV)
────────────────────────────── */
router.get("/", getSiteSettings);

/* ──────────────────────────────
   🔒 ADMIN (POST-PMV)
   (NO USAR AÚN, pero ya está listo)
────────────────────────────── */
router.put("/", protegerRuta, updateSiteSettings);

export default router;
