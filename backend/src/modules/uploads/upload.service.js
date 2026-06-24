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
    logger.info({
      step: "UPLOAD_BEFORE",
      message: "Antes de llamar a Cloudinary",
      hasFile: !!file,
      mimetype: file?.mimetype,
      size: file?.size,
      bufferLength: file?.buffer?.length,
      folder,
    });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder,
        },
        (error, result) => {
          if (error) {
            console.error("UPLOAD_DURING_ERROR", {
              message: error?.message,
              name: error?.name,
              http_code: error?.http_code,
              code: error?.code,
              statusCode: error?.statusCode,
            });

            return reject(error);
          }

          logger.info({
            step: "UPLOAD_DURING_SUCCESS",
            message: "Cloudinary respondió correctamente",
            publicId: result?.public_id,
            secureUrl: result?.secure_url,
          });

          resolve(result);
        },
      );

      logger.info({
        step: "UPLOAD_DURING",
        message: "Stream creado, enviando buffer a Cloudinary",
      });

      stream.end(file.buffer);
    });

    logger.info({
      step: "UPLOAD_AFTER",
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
    console.error("UPLOAD_AFTER_ERROR", {
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
