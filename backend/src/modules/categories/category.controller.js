import logger from "../../shared/logger/logger.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";

import {
  crearCategoriaService,
  listarCategoriasService,
  obtenerCategoriaService,
  actualizarCategoriaService,
  eliminarCategoriaService,
  subirImagenCategoriaService,
} from "./category.service.js";

/* CREAR */
export const crearCategoria = asyncHandler(async (req, res) => {
  const categoria = await crearCategoriaService(req.body, req.file);

  logger.info({
    message: "Category created",
    categoryId: categoria.id_categoria,
  });

  return res.success({
    status: 201,
    message: "Categoría creada correctamente",
    data: categoria,
  });
});

/* LISTAR */
export const listarCategorias = asyncHandler(async (req, res) => {
  const categorias = await listarCategoriasService();

  return res.success({ data: categorias });
});

/* OBTENER */
export const obtenerCategoria = asyncHandler(async (req, res) => {
  const categoria = await obtenerCategoriaService(req.params.id);

  return res.success({ data: categoria });
});

/* ACTUALIZAR */
export const actualizarCategoria = asyncHandler(async (req, res) => {
  const categoria = await actualizarCategoriaService(req.params.id, req.body);

  return res.success({
    message: "Categoría actualizada correctamente",
    data: categoria,
  });
});

/* ELIMINAR */
export const eliminarCategoria = asyncHandler(async (req, res) => {
  await eliminarCategoriaService(req.params.id);

  return res.success({
    message: "Categoría eliminada correctamente",
  });
});

/* SUBIR IMAGEN */
export const subirImagenCategoria = asyncHandler(async (req, res) => {
  const result = await subirImagenCategoriaService(req.params.id, req.file);

  logger.info({
    message: "Category image uploaded",
    categoryId: Number(req.params.id),
    hasFile: Boolean(req.file),
  });

  return res.success({
    message: "Imagen subida correctamente",
    data: result,
  });
});
