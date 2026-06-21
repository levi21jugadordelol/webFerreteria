import { apiFetch } from "../../api/client";

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
};

export function getDashboardStats(): Promise<DashboardStats> {
  return apiFetch("/dashboard");
}

export function getActividadReciente(): Promise<Actividad[]> {
  return apiFetch("/dashboard/actividad");
}
