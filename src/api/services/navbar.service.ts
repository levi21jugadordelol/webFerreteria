import { getMenu } from "../../libs/apis/menu.api";
import { getSiteSettings } from "../../libs/apis/settings.api";
import { getCategorias } from "../../libs/apis/categoria.api";
import { getMarcas } from "../../libs/apis/brand.api";

export async function loadNavbarData() {
  const results = await Promise.allSettled([
    getMenu(),
    getSiteSettings(),
    getCategorias(),
    getMarcas(),
  ]);

  const [menuResult, settingsResult, categoriasResult, marcasResult] = results;

  console.log("NAVBAR DEBUG:", {
    menu: menuResult.status,
    settings: settingsResult.status,
    categorias: categoriasResult.status,
    marcas: marcasResult.status,
  });

  if (menuResult.status === "rejected") {
    console.error("Error al cargar menú:", menuResult.reason);
  }

  if (settingsResult.status === "rejected") {
    console.error("Error al cargar settings:", settingsResult.reason);
  }

  if (categoriasResult.status === "rejected") {
    console.error("Error al cargar categorías:", categoriasResult.reason);
  }

  if (marcasResult.status === "rejected") {
    console.error("Error al cargar marcas:", marcasResult.reason);
  }

  return {
    menu: menuResult.status === "fulfilled" ? menuResult.value : [],
    settings: settingsResult.status === "fulfilled" ? settingsResult.value : {},
    categorias:
      categoriasResult.status === "fulfilled" ? categoriasResult.value : [],
    marcas: marcasResult.status === "fulfilled" ? marcasResult.value : [],
  };
}
