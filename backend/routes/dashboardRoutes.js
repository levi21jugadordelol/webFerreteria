import express from "express";
import protegerRuta from "../middleware/protegerRuta.js";

import {
  estadisticasDashboard,
  actividadReciente,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/", protegerRuta, estadisticasDashboard);
router.get("/actividad", protegerRuta, actividadReciente);

export default router;
