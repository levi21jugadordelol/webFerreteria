import express from "express";

import {
  getSiteSettingsController,
  updateSiteSettingsController,
} from "./settings.controller.js";

import protegerRuta from "../../shared/middleware/protegerRuta.js";

const router = express.Router();

router.get("/", getSiteSettingsController);
router.put("/", protegerRuta, updateSiteSettingsController);

export default router;
