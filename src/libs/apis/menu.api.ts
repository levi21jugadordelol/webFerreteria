// libs/api/menu.api.ts

const API_URL = "http://localhost:3000";

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
};

type MenuResponse = {
  msg?: string;
};

/* =========================
   MENU PUBLICO
========================= */
export async function getMenu(): Promise<MenuItem[]> {
  const res = await fetch(`${API_URL}/menu`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al obtener menú");
  }

  return data;
}

/* =========================
   LISTAR ADMIN
========================= */
export async function getMenuAdmin(): Promise<MenuItem[]> {
  const res = await fetch(`${API_URL}/menu/admin/lista`, {
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al obtener menú admin");
  }

  return data;
}

/* =========================
   CREAR
========================= */
export async function crearMenu(data: {
  titulo: string;
  url: string;
  tipo?: string;
  orden?: number;
  activo?: boolean;
}): Promise<MenuItem> {
  const res = await fetch(`${API_URL}/menu/admin`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.msg || "Error al crear menú");
  }

  return result;
}

/* =========================
   ACTUALIZAR
========================= */
export async function actualizarMenu(
  id: string,
  data: Partial<MenuItem>,
): Promise<MenuResponse> {
  const res = await fetch(`${API_URL}/menu/admin/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.msg || "Error al actualizar menú");
  }

  return result;
}

/* =========================
   ELIMINAR
========================= */
export async function eliminarMenu(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/menu/admin/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al eliminar menú");
  }
}
