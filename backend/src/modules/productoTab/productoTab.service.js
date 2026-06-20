import ProductoTab from "./productoTab.model.js";
import ProductoCaracteristica from "../productCaracteristica/productCarac.model.js";
import { generarSlugUnico } from "../../shared/helpers/generarSlugUnico.js";
import AppError from "../../shared/utils/AppError.js";

class ProductoTabService {
  static async listarTabs() {
    return await ProductoTab.findAll({
      order: [
        ["orden", "ASC"],
        ["id_tab", "ASC"],
      ],
    });
  }

  static async crearTab(data) {
    const nombre = String(data.nombre || "").trim();
    const orden = Number(data.orden || 0);

    if (!nombre) {
      throw new AppError("Nombre es obligatorio", 400);
    }

    const slug = await generarSlugUnico({
      modelo: ProductoTab,
      valor: data.slug || nombre,
      campo: "slug",
      idCampo: "id_tab",
    });

    return await ProductoTab.create({
      nombre,
      slug,
      orden,
      activo: true,
    });
  }

  static async actualizarTab(id, data) {
    const tab = await ProductoTab.findByPk(Number(id));

    if (!tab) {
      throw new AppError("Tab no encontrada", 404);
    }

    const camposPermitidos = {};

    if (data.nombre !== undefined) {
      const nombre = String(data.nombre || "").trim();

      if (!nombre) {
        throw new AppError("Nombre es obligatorio", 400);
      }

      camposPermitidos.nombre = nombre;

      if (nombre !== tab.nombre) {
        camposPermitidos.slug = await generarSlugUnico({
          modelo: ProductoTab,
          valor: nombre,
          excludeId: tab.id_tab,
          idCampo: "id_tab",
        });
      }
    }

    if (data.orden !== undefined) {
      camposPermitidos.orden = Number(data.orden);
    }

    if (data.activo !== undefined) {
      camposPermitidos.activo =
        data.activo === true || data.activo === "true" || data.activo === "on";
    }

    await tab.update(camposPermitidos);

    return tab;
  }

  static async toggleTab(id) {
    const tab = await ProductoTab.findByPk(Number(id));

    if (!tab) {
      throw new AppError("Tab no encontrada", 404);
    }

    tab.activo = !tab.activo;
    await tab.save();

    return tab;
  }

  static async eliminarTab(id) {
    const tabId = Number(id);

    const tab = await ProductoTab.findByPk(tabId);

    if (!tab) {
      throw new AppError("Tab no encontrada", 404);
    }

    const usadas = await ProductoCaracteristica.count({
      where: { tab_id: tabId },
    });

    if (usadas > 0) {
      throw new AppError(
        "No se puede eliminar una tab con características asociadas",
        400,
      );
    }

    await tab.destroy();

    return true;
  }
}

export { ProductoTabService };
