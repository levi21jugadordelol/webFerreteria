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
    console.log("FILE DEBUG", {
      exists: !!file,
      mimetype: file?.mimetype,
      size: file?.size,
      bufferLength: file?.buffer?.length,
    });

    console.log("CLOUDINARY CONFIG DEBUG", {
      cloud_name: cloudinary.config().cloud_name,
      api_key: cloudinary.config().api_key,
      api_secret_exists: !!cloudinary.config().api_secret,
    });

    console.log("UPLOAD URL", cloudinary.utils.api_url("upload"));

    // TEST TEMPORAL: descarta Multer, buffer, PNG y frontend
    const result = await cloudinary.uploader.upload(
      "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      {
        resource_type: "image",
      },
    );

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
    console.error("CLOUDINARY_RAW_ERROR", error);

    console.error("FULL ERROR", JSON.stringify(error, null, 2));

    console.error("CLOUDINARY_ERROR_DETAILS", {
      message: error?.message,
      name: error?.name,
      http_code: error?.http_code,
      code: error?.code,
      statusCode: error?.statusCode,
      response: error?.response,
      error,
    });

    logger.error({
      message: "Error subiendo imagen a Cloudinary",
      errorMessage: error?.message,
      errorName: error?.name,
      httpCode: error?.http_code,
      code: error?.code,
      statusCode: error?.statusCode,
      folder,
    });

    throw new AppError("Error subiendo imagen", 500);
  }
};
