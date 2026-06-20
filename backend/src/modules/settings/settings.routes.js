import express from "express";

import {
  getSiteSettingsController,
  updateSiteSettingsController,
} from "./settings.controller.js";

import protegerRuta from "../../shared/middleware/protegerRuta.js";
import { validateResult } from "../../shared/middleware/validateResult.js";
import { validarUpdateSettings } from "./settings.validator.js";

const router = express.Router();

router.get("/", getSiteSettingsController);

router.put(
  "/",
  protegerRuta,
  validarUpdateSettings,
  validateResult,
  updateSiteSettingsController,
);

export default router;
