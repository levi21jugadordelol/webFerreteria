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
  revertirComprobante,
} from "../controllers/comprobantePagoController.js";

const router = express.Router();

router.use((req, res, next) => {
  console.log(chalk.bgBlue.white(`📥 [ROUTE] /pagos ${req.method} ${req.url}`));
  next();
});

// 🟢 Cliente
router.post(
  "/comprobante",
  uploadComprobante.single("file"),
  (req, res, next) => {
    console.log(chalk.cyan("🧪 [MULTER] req.file =>"), req.file);
    console.log(chalk.cyan("🧪 [MULTER] req.body =>"), req.body);
    next();
  },
  subirComprobante
);

// 🔒 Admin
router.get("/admin/lista", protegerRuta, listarComprobantes);
router.put("/admin/:id/validar", protegerRuta, validarComprobante);
router.put("/admin/:id/revertir", protegerRuta, revertirComprobante);
router.put("/admin/:id/rechazar", protegerRuta, rechazarComprobante);

export default router;
