export function generarSlug(texto) {
  return texto
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quitar tildes
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // quitar caracteres raros
    .replace(/\s+/g, "-") // espacios por guiones
    .replace(/-+/g, "-"); // evitar guiones dobles
}
