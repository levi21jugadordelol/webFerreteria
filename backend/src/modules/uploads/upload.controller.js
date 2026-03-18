import logger from "../../shared/logger/logger.js";

export const subirImagenEditor = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        msg: "Debe subir una imagen",
      });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const url = `${baseUrl}/uploads/editor/${req.file.filename}`;

    logger.info({
      message: "Imagen subida editor",
      url,
    });

    res.json({ url });
  } catch (error) {
    logger.error({
      message: "Error subir imagen editor",
      error: error.message,
    });

    res.status(500).json({
      msg: "Error al subir imagen",
    });
  }
};
