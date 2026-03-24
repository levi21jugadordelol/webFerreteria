import multer from "multer";
import path from "path";
import fs from "fs";
import { fileTypeFromBuffer } from "file-type";

export function crearUpload(destino) {
  const uploadDir = path.join(process.cwd(), destino);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.memoryStorage();

  const upload = multer({
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  return (req, res, next) => {
    const handler = upload.single("file");

    handler(req, res, async (err) => {
      if (err) return next(err);

      if (!req.file) {
        return next(new Error("No se subió ningún archivo"));
      }

      try {
        // 🔍 Detectar tipo REAL del archivo
        const type = await fileTypeFromBuffer(req.file.buffer);

        if (!type || !allowedTypes.includes(type.mime)) {
          return next(new Error("Tipo de archivo no permitido"));
        }

        // 📝 Generar nombre seguro
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

        const filename = `file-${uniqueSuffix}.${type.ext}`;
        const filepath = path.join(uploadDir, filename);

        // 💾 Guardar archivo SOLO si es válido
        fs.writeFileSync(filepath, req.file.buffer);

        // 📌 Adjuntar info al request
        req.file.filename = filename;
        req.file.path = filepath;
        req.file.mimetype = type.mime;

        next();
      } catch (error) {
        next(error);
      }
    });
  };
}
