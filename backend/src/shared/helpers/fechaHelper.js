export function formatearFechaHora(fecha) {
  if (!fecha) return "-";

  const d = new Date(fecha);

  return d.toLocaleString("es-PE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
