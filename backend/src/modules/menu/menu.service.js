// menu.service.js
import Menu from "./menu.model.js";
import AppError from "../../shared/utils/AppError.js";

/* =========================
   HELPERS
========================= */
const normalizarMenuInput = (data = {}) => {
  const titulo = String(data.titulo || "").trim();
  const tipo = String(data.tipo || "").trim();
  const url = String(data.url || "").trim();
  const orden = Number(data.orden || 0);
  const activo = data.activo === true || data.activo === "true";
  const parent_id = data.parent_id ? Number(data.parent_id) : null;

  return {
    titulo,
    tipo,
    url,
    orden,
    activo,
    parent_id,
  };
};

const validarMenuInput = ({ titulo, tipo, url }) => {
  if (!titulo || !tipo || !url) {
    throw new AppError("Título, tipo y url son obligatorios", 400);
  }

  if (!["pagina", "ruta"].includes(tipo)) {
    throw new AppError("Tipo inválido", 400);
  }

  if (!/^\/[a-zA-Z0-9/_-]*$/.test(url)) {
    throw new AppError("URL inválida", 400);
  }
};

/* =========================
   🟢 MENU PUBLICO
========================= */
export const obtenerMenuPublico = async () => {
  const items = await Menu.findAll({
    where: { activo: true },
    order: [["orden", "ASC"]],
    raw: true,
  });

  return construirArbolMenu(items);
};

/* =========================
   🔥 CONVERTIR A ÁRBOL
========================= */
const construirArbolMenu = (items) => {
  const mapa = {};
  const menu = [];

  items.forEach((item) => {
    item.children = [];
    mapa[item.id_menu] = item;
  });

  items.forEach((item) => {
    if (item.parent_id) {
      mapa[item.parent_id]?.children.push(item);
    } else {
      menu.push(item);
    }
  });

  return menu;
};

/* =========================
   🟢 ADMIN LIST
========================= */
export const listarMenu = async () => {
  return await Menu.findAll({
    order: [["orden", "ASC"]],
  });
};

/* =========================
   🔒 CREAR
========================= */
export const crearItemMenu = async (data) => {
  const input = normalizarMenuInput(data);

  validarMenuInput(input);

  return await Menu.create(input);
};

/* =========================
   🔄 UPDATE
========================= */
export const actualizarItemMenu = async (id, data) => {
  const menu = await Menu.findByPk(id);

  if (!menu) {
    throw new AppError("Enlace no encontrado", 404);
  }

  const input = normalizarMenuInput(data);

  validarMenuInput(input);

  await menu.update(input);

  return menu;
};

/* =========================
   🔒 DELETE
========================= */
export const eliminarItemMenu = async (id) => {
  const menu = await Menu.findByPk(id);

  if (!menu) {
    throw new AppError("Enlace no encontrado", 404);
  }

  await menu.destroy();

  return true;
};

/* =========================
   🔄 ORDEN
========================= */
export const actualizarOrdenMenuService = async (menus) => {
  if (!Array.isArray(menus)) {
    throw new AppError("Datos inválidos", 400);
  }

  await Promise.all(
    menus.map((item) =>
      Menu.update(
        { orden: Number(item.orden) },
        { where: { id_menu: Number(item.id_menu) } },
      ),
    ),
  );

  return true;
};

/* =========================
   🆔 GET POR ID
========================= */
export const obtenerMenuPorIdService = async (id) => {
  const menu = await Menu.findByPk(id, { raw: true });

  if (!menu) {
    throw new AppError("Enlace no encontrado", 404);
  }

  return menu;
};
