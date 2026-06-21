import { apiFetch } from "../../api/client";

/* =========================
   TIPOS
========================= */
type ProductoTab = {
  id_tab: number;
  nombre: string;
  slug: string;
  orden: number;
  activo: boolean;
};

type TabResponse = {
  msg: string;
  tab?: ProductoTab;
};

/* =========================
   LISTAR (PUBLICO)
========================= */
export function getTabs(): Promise<ProductoTab[]> {
  return apiFetch("/producto-tabs");
}

/* =========================
   CREAR TAB
========================= */
export function crearTab(data: {
  nombre: string;
  slug?: string;
  orden?: number;
}): Promise<TabResponse> {
  return apiFetch("/producto-tabs", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* =========================
   ACTUALIZAR TAB
========================= */
export function actualizarTab(
  id: string,
  data: {
    nombre?: string;
    slug?: string;
    orden?: number;
  },
): Promise<TabResponse> {
  return apiFetch(`/producto-tabs/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/* =========================
   ACTIVAR / DESACTIVAR
========================= */
export function toggleTab(id: string): Promise<TabResponse> {
  return apiFetch(`/producto-tabs/${id}/toggle`, {
    method: "PATCH",
  });
}

/* =========================
   ELIMINAR TAB
========================= */
export function eliminarTab(id: string): Promise<void> {
  return apiFetch(`/producto-tabs/${id}`, {
    method: "DELETE",
  });
}
