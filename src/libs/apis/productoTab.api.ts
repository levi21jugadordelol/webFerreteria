// libs/api/productoTab.api.ts

const API_URL = "http://localhost:3000";

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
export async function getTabs(): Promise<ProductoTab[]> {
  const res = await fetch(`${API_URL}/producto-tabs`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al obtener tabs");
  }

  return data;
}

/* =========================
   CREAR TAB
========================= */
export async function crearTab(data: {
  nombre: string;
  slug?: string;
  orden?: number;
}): Promise<TabResponse> {
  const res = await fetch(`${API_URL}/producto-tabs`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.msg || "Error al crear tab");
  }

  return result;
}

/* =========================
   ACTUALIZAR TAB
========================= */
export async function actualizarTab(
  id: string,
  data: {
    nombre?: string;
    slug?: string;
    orden?: number;
  },
): Promise<TabResponse> {
  const res = await fetch(`${API_URL}/producto-tabs/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.msg || "Error al actualizar tab");
  }

  return result;
}

/* =========================
   ACTIVAR / DESACTIVAR
========================= */
export async function toggleTab(id: string): Promise<TabResponse> {
  const res = await fetch(`${API_URL}/producto-tabs/${id}/toggle`, {
    method: "PATCH",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al cambiar estado");
  }

  return data;
}

/* =========================
   ELIMINAR TAB
========================= */
export async function eliminarTab(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/producto-tabs/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al eliminar tab");
  }
}
