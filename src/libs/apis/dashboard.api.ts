// libs/api/dashboard.api.ts

const API_URL = "http://localhost:3000";

/* =========================
   TIPOS
========================= */
type DashboardStats = {
  totalProductos: number;
  ventasHoy: number;
  pagosPendientes: number;
  stockBajo: number;
};

type Actividad = {
  id: number;
  accion: string;
  fecha: string;
  // agrega más campos si tienes más en el modelo
};

/* =========================
   ESTADÍSTICAS DASHBOARD
========================= */
export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_URL}/dashboard`, {
    method: "GET",
    credentials: "include", // 🔥 protegerRuta
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al obtener estadísticas");
  }

  return data;
}

/* =========================
   ACTIVIDAD RECIENTE
========================= */
export async function getActividadReciente(): Promise<Actividad[]> {
  const res = await fetch(`${API_URL}/dashboard/actividad`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al obtener actividad");
  }

  return data;
}
