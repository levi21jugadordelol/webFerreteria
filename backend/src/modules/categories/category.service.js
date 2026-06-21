import Categoria from "./category.model.js";
import AppError from "../../shared/utils/AppError.js";
import { subirImagenEditorService } from "../uploads/upload.service.js";
import sanitizeHtml from "sanitize-html";

const sanitizarTexto = (valor = "") => {
  return sanitizeHtml(String(valor || ""), {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
};

/* CREAR */
export const crearCategoriaService = async (data, file) => {
  const nombreCategoria = sanitizarTexto(data.nombre_categoria);
  const descripcion = sanitizarTexto(data.descripcion);

  if (!nombreCategoria || nombreCategoria.length < 2) {
    throw new AppError("Nombre de categoría inválido", 400);
  }

  const existe = await Categoria.findOne({
    where: { nombre_categoria: nombreCategoria },
  });

  if (existe) {
    throw new AppError("Ya existe una categoría", 400);
  }

  let urlImagen = null;

  if (file) {
    const upload = await subirImagenEditorService(file, "categorias");
    urlImagen = upload.url;
  }

  return await Categoria.create({
    nombre_categoria: nombreCategoria,
    descripcion,
    url_imagen: urlImagen,
  });
};

/* LISTAR */
export const listarCategoriasService = async () => {
  return await Categoria.findAll({
    order: [["id_categoria", "ASC"]],
  });
};

/* OBTENER */
export const obtenerCategoriaService = async (id) => {
  const categoria = await Categoria.findByPk(id);

  if (!categoria) {
    throw new AppError("Categoría no encontrada", 404);
  }

  return categoria;
};

/* ELIMINAR */
export const eliminarCategoriaService = async (id) => {
  const categoria = await Categoria.findByPk(id);

  if (!categoria) {
    throw new AppError("Categoría no encontrada", 404);
  }

  await categoria.destroy();

  return true;
};

/* ACTUALIZAR */
export const actualizarCategoriaService = async (id, data) => {
  const categoria = await Categoria.findByPk(Number(id));

  if (!categoria) {
    throw new AppError("Categoría no encontrada", 404);
  }

  const camposPermitidos = {};

  if (data.nombre_categoria !== undefined) {
    const nombreCategoria = sanitizarTexto(data.nombre_categoria);

    if (!nombreCategoria || nombreCategoria.length < 2) {
      throw new AppError("Nombre de categoría inválido", 400);
    }

    camposPermitidos.nombre_categoria = nombreCategoria;
  }

  if (data.descripcion !== undefined) {
    camposPermitidos.descripcion = sanitizarTexto(data.descripcion);
  }

  await categoria.update(camposPermitidos);

  return categoria;
};

/* SUBIR IMAGEN */
export const subirImagenCategoriaService = async (id, file) => {
  const categoria = await Categoria.findByPk(id);

  if (!categoria) {
    throw new AppError("Categoría no encontrada", 404);
  }

  if (!file) {
    throw new AppError("No se subió ninguna imagen", 400);
  }

  const upload = await subirImagenEditorService(file, "categorias");

  categoria.url_imagen = upload.url;
  await categoria.save();

  return {
    url_imagen: categoria.url_imagen,
  };
};
