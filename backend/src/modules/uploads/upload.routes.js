import express from "express";
import chalk from "chalk";

import uploadEditor from "../../../middleware/uploadEditor.js";
import { subirImagenEditor } from "./upload.controller.js";

import protegerRuta from "../../../middleware/protegerRuta.js";

const router = express.Router();

/* LOG */

router.use((req, res, next) => {
  console.log(chalk.bgMagenta.white(`📥 [ROUTE] /uploads${req.originalUrl}`));
  next();
});

/* SUBIR IMAGEN EDITOR */

router.post(
  "/editor",
  protegerRuta,
  uploadEditor.single("imagen"),
  subirImagenEditor,
);

export default router;
