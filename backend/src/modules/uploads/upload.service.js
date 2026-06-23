import logger from "../../shared/logger/logger.js";
import AppError from "../../shared/utils/AppError.js";
import cloudinary from "../../config/cloudinary.js";

/* =========================
   SUBIR IMAGEN EDITOR
========================= */
export const subirImagenEditorService = async (file, folder = "editor") => {
  if (!file) {
    throw new AppError("Debe subir una imagen", 400);
  }

  const allowed = ["image/jpeg", "image/png", "image/webp"];

  if (!allowed.includes(file.mimetype)) {
    throw new AppError("Formato de imagen no permitido", 400);
  }

  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            transformation: [
              { quality: "auto" },
              { fetch_format: "auto" },
              { width: 1200, crop: "limit" },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        )
        .end(file.buffer);
    });

    logger.info({
      message: "Imagen subida a Cloudinary",
      publicId: result.public_id,
      folder,
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("CLOUDINARY_UPLOAD_ERROR_FULL", {
      message: error?.message,
      name: error?.name,
      http_code: error?.http_code,
    });

    logger.error({
      message: "Error subiendo imagen a Cloudinary",
      errorMessage: error?.message,
      errorName: error?.name,
      httpCode: error?.http_code,
      folder,
    });

    throw new AppError("Error subiendo imagen", 500);
  }
};
