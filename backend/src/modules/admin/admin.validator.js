import { check } from "express-validator";

/* =========================
   LOGIN
========================= */
export const validarLogin = [
  check("correo")
    .notEmpty()
    .withMessage("El correo es obligatorio")
    .isEmail()
    .withMessage("Debe ser un correo válido")
    .normalizeEmail(),

  check("password").notEmpty().withMessage("La contraseña es obligatoria"),
];

/* =========================
   REGISTRO
========================= */
export const validarRegistro = [
  check("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),

  check("correo")
    .notEmpty()
    .withMessage("El correo es obligatorio")
    .isEmail()
    .withMessage("Debe ser un correo válido")
    .normalizeEmail(),

  check("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 8, max: 100 })
    .withMessage("La contraseña debe tener entre 8 y 100 caracteres"),
];
