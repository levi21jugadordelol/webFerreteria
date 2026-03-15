export function tiempoPendiente(fechaEnvio) {
  if (!fechaEnvio) return "-";

  const ahora = new Date();
  const envio = new Date(fechaEnvio);

  const diff = Math.floor((ahora - envio) / 1000);

  const horas = Math.floor(diff / 3600);
  const minutos = Math.floor((diff % 3600) / 60);

  return `${horas}h ${minutos}m`;
}
