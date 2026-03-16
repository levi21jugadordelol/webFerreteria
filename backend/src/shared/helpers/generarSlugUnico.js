import Producto from "../../modules/products/producto.model.js";
import { generarSlug } from "./generarSlug.js";

export async function generarSlugUnico(nombreProducto, excludeId = null) {
  const baseSlug = generarSlug(nombreProducto);
  let slug = baseSlug;
  let contador = 1;

  while (true) {
    const where = { slug };

    const productoExistente = await Producto.findOne({ where });

    if (!productoExistente) {
      return slug;
    }

    if (excludeId && productoExistente.id_producto === Number(excludeId)) {
      return slug;
    }

    slug = `${baseSlug}-${contador}`;
    contador++;
  }
}
