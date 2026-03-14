import chalk from "chalk";

export const subirImagenEditor = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        msg: "Debe subir una imagen",
      });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const url = `${baseUrl}/uploads/editor/${req.file.filename}`;

    console.log(chalk.green("🖼️ Imagen subida editor:"), url);

    res.json({ url });
  } catch (error) {
    console.error("❌ Error subir imagen editor:", error);

    res.status(500).json({
      msg: "Error al subir imagen",
    });
  }
};
