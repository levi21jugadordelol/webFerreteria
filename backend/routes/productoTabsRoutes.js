import express from "express";
import { listarTabs } from "../controllers/productoTabController.js";

const router = express.Router();

router.get("/", listarTabs);

export default router;
