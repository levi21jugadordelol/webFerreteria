// routes/pedidoRouter.js
import express from "express";
import chalk from "chalk";
import { crearPedido } from "../controllers/pedidoController.js";

const router = express.Router();

router.use((req, res, next) => {
  console.log(chalk.bgBlue.white(`📥 [ROUTE] /pedidos${req.url}`));
  next();
});

/* 🟢 Público */
router.post("/", crearPedido);

export default router;
