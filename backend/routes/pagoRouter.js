// routes/pagoRouter.js
import express from "express";
import chalk from "chalk";
import protegerRuta from "../middleware/protegerRuta.js";
import uploadComprobante from "../middleware/uploadComprobante.js";

import {
  subirComprobante,
  listarComprobantes,
  validarComprobante,
  rechazarComprobante,
} from "../controllers/comprobantePagoController.js";

const router = express.Router();

/* --------------------
   🪵 Logging del router
-------------------- */
router.use((req, res, next) => {
  console.log(chalk.bgBlue.white(`📥 [ROUTE] /pagos${req.url}`));
  next();
});

/* --------------------
   🟢 Rutas públicas (cliente)
-------------------- */
router.post("/comprobante", uploadComprobante.single("file"), subirComprobante);

/* --------------------
   🔒 Rutas admin
-------------------- */
router.get("/admin/lista", protegerRuta, listarComprobantes);

router.put("/admin/:id/validar", protegerRuta, validarComprobante);

router.put("/admin/:id/rechazar", protegerRuta, rechazarComprobante);

export default router;
