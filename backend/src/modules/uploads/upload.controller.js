import asyncHandler from "../../shared/utils/asyncHandler.js";
import { subirImagenEditorService } from "./upload.service.js";

export const subirImagenEditor = asyncHandler(async (req, res) => {
  const result = await subirImagenEditorService(req.file, "editor"); // ← agregar "editor"

  return res.success({
    data: result,
  });
});
