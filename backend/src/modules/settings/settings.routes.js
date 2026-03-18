import express from "express";

import { getSiteSettings, updateSiteSettings } from "./settings.controller.js";

import protegerRuta from "../../shared/middleware/protegerRuta.js";

const router = express.Router();

/* ──────────────────────────────
   🟢 GET PUBLICO
────────────────────────────── */
router.get("/", getSiteSettings);

/* ──────────────────────────────
   🔒 ADMIN
────────────────────────────── */
router.put("/", protegerRuta, updateSiteSettings);

export default router;
