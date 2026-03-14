import express from "express";
import { listarTabs } from "../../modules/productoTab/productoTab.controller.js";

const router = express.Router();

router.get("/", listarTabs);

export default router;
