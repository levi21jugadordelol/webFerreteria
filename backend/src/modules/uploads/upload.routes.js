import express from "express";

import uploadEditor from "../../shared/middleware/uploadEditor.js";
import { subirImagenEditor } from "./upload.controller.js";

import protegerRuta from "../../shared/middleware/protegerRuta.js";

import { uploadLimiter } from "../../shared/middleware/rateLimiters.js";

const router = express.Router();

/* SUBIR IMAGEN EDITOR */

router.post(
  "/editor",
  protegerRuta,
  uploadLimiter,
  uploadEditor,
  subirImagenEditor,
);

export default router;
