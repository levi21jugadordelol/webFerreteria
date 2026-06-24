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
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder,
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          return resolve(result);
        },
      );

      stream.end(file.buffer);
    });

    logger.info({
      message: "Imagen subida a Cloudinary",
      publicId: result.public_id,
      secureUrl: result.secure_url,
      folder,
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("CLOUDINARY_UPLOAD_ERROR", {
      message: error?.message,
      name: error?.name,
      http_code: error?.http_code,
      code: error?.code,
      statusCode: error?.statusCode,
      folder,
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
