import { generarSlug } from "./generarSlug.js";

export async function generarSlugUnico({
  modelo,
  campo = "slug",
  valor,
  excludeId = null,
  idCampo = "id",
}) {
  const baseSlug = generarSlug(valor);
  let slug = baseSlug;
  let contador = 1;

  while (true) {
    const where = { [campo]: slug };

    const existente = await modelo.findOne({ where });

    if (!existente) return slug;

    if (excludeId && existente[idCampo] === Number(excludeId)) {
      return slug;
    }

    slug = `${baseSlug}-${contador}`;
    contador++;
  }
}
