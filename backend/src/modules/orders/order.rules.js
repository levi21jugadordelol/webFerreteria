export const TIPOS_DOCUMENTO = ["DNI", "RUC", "CE", "SIN_DOCUMENTO"];

export function validarNumeroDocumento(tipo, numero) {
  if (tipo === "SIN_DOCUMENTO") return true;

  if (!numero) {
    throw new Error("Debe ingresar el número de documento");
  }

  if (tipo === "DNI" && !/^\d{8}$/.test(numero)) {
    throw new Error("El DNI debe tener 8 dígitos");
  }

  if (tipo === "RUC" && !/^\d{11}$/.test(numero)) {
    throw new Error("El RUC debe tener 11 dígitos");
  }

  if (tipo === "CE" && !/^[A-Za-z0-9]{6,20}$/.test(numero)) {
    throw new Error("El CE debe tener entre 6 y 20 caracteres");
  }

  return true;
}
