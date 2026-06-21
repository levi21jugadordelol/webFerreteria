import Marca from "../../modules/brands/marca.model.js";
import { subirImagenEditorService } from "../uploads/upload.service.js";
import AppError from "../../shared/utils/AppError.js";
import sanitizeHtml from "sanitize-html";

const sanitizarTexto = (valor = "") => {
  return sanitizeHtml(String(valor || ""), {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
};

/* =========================
   CREAR MARCA
========================= */
export const crearMarcaService = async ({ nombre_marca, descripcion }) => {
  const nombreMarca = sanitizarTexto(nombre_marca);
  const descripcionLimpia = sanitizarTexto(descripcion);

  if (!nombreMarca || nombreMarca.length < 2) {
    throw new AppError("Nombre de marca inválido", 400);
  }

  const existe = await Marca.findOne({
    where: { nombre_marca: nombreMarca },
  });

  if (existe) {
    throw new AppError("Ya existe una marca con ese nombre", 400);
  }

  return await Marca.create({
    nombre_marca: nombreMarca,
    descripcion: descripcionLimpia,
  });
};

/* =========================
   LISTAR MARCAS
========================= */
export const listarMarcasService = async () => {
  return await Marca.findAll({
    order: [["id_marca", "ASC"]],
  });
};

/* =========================
   OBTENER MARCA
========================= */
export const obtenerMarcaService = async (id) => {
  const marca = await Marca.findByPk(id);

  if (!marca) {
    throw new AppError("Marca no encontrada", 404);
  }

  return marca;
};

/* =========================
   ACTUALIZAR MARCA
========================= */
export const actualizarMarcaService = async (id, data) => {
  const marca = await Marca.findByPk(Number(id));

  if (!marca) {
    throw new AppError("Marca no encontrada", 404);
  }

  const camposPermitidos = {};

  if (data.nombre_marca !== undefined) {
    const nombreMarca = sanitizarTexto(data.nombre_marca);

    if (!nombreMarca || nombreMarca.length < 2) {
      throw new AppError("Nombre de marca inválido", 400);
    }

    camposPermitidos.nombre_marca = nombreMarca;
  }

  if (data.descripcion !== undefined) {
    camposPermitidos.descripcion = sanitizarTexto(data.descripcion);
  }

  await marca.update(camposPermitidos);

  return marca;
};

/* =========================
   ELIMINAR MARCA
========================= */
export const eliminarMarcaService = async (id) => {
  const marca = await Marca.findByPk(id);

  if (!marca) {
    throw new AppError("Marca no encontrada", 404);
  }

  await marca.destroy();

  return true;
};

/* =========================
   SUBIR LOGO
========================= */
export const subirLogoMarcaService = async (id, file) => {
  const marca = await Marca.findByPk(id);

  if (!marca) {
    throw new AppError("Marca no encontrada", 404);
  }

  if (!file) {
    throw new AppError("No se subió ningún logo", 400);
  }

  const upload = await subirImagenEditorService(file, "marcas");

  marca.url_logo = upload.url;

  await marca.save();

  return {
    url_logo: marca.url_logo,
  };
};
