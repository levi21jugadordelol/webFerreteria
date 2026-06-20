import multer from "multer";
import { fileTypeFromBuffer } from "file-type";

export function crearUpload() {
  const storage = multer.memoryStorage();

  const upload = multer({
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  return (req, res, next) => {
    const handler = upload.single("imagen");

    handler(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          ok: false,
          message: "El archivo excede el tamaño permitido (5MB)",
        });
      }

      // Otros errores de multer o middleware
      if (err) {
        return next(err);
      }

      if (!req.file) {
        return res.status(400).json({
          ok: false,
          message: "No se subió ningún archivo",
        });
      }

      try {
        const type = await fileTypeFromBuffer(req.file.buffer);

        if (!type || !allowedTypes.includes(type.mime)) {
          return res.status(400).json({
            ok: false,
            message:
              "Tipo de archivo no permitido. Solo se permite JPG, PNG o WEBP.",
          });
        }

        req.file.mimetype = type.mime;

        next();
      } catch (error) {
        next(error);
      }
    });
  };
}
