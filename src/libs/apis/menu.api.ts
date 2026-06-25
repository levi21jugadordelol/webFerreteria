import { apiFetch } from "../../api/client";

/* =========================
   TIPOS
========================= */
type MenuItem = {
  id_menu: number;
  titulo: string;
  url: string;
  tipo: string;
  orden: number;
  activo: boolean;
  parent_id?: number | null;
};

type MenuResponse = {
  msg?: string;
};

/* =========================
   MENU PUBLICO
========================= */
export function getMenu(): Promise<MenuItem[]> {
  return apiFetch("/menu"); // 🔥 CAMBIO
}

/* =========================
   LISTAR ADMIN
========================= */
export function getMenuAdmin(): Promise<MenuItem[]> {
  return apiFetch("/menu/admin/lista"); // 🔥 CAMBIO
}

/* =========================
   CREAR
========================= */
export function crearMenu(data: {
  titulo: string;
  url: string;
  tipo?: string;
  orden?: number;
  activo?: boolean;
}): Promise<MenuItem> {
  return apiFetch("/menu/admin", {
    // 🔥 CAMBIO
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* =========================
   ACTUALIZAR
========================= */
export function actualizarMenu(
  id: string,
  data: Partial<MenuItem>,
): Promise<MenuResponse> {
  return apiFetch(`/menu/admin/${id}`, {
    // 🔥 CAMBIO
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/* =========================
   ELIMINAR
========================= */
export function eliminarMenu(id: string): Promise<void> {
  return apiFetch(`/menu/admin/${id}`, {
    // 🔥 CAMBIO
    method: "DELETE",
  });
}

export function getMenuAdminById(id: string): Promise<MenuItem> {
  return apiFetch(`/menu/admin/${id}`);
}
