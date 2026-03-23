import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import logger from "../shared/logger/logger.js";

const transport = nodemailer.createTransport({
  host: env.EMAIL.HOST,
  port: env.EMAIL.PORT,
  auth: {
    user: env.EMAIL.USER,
    pass: env.EMAIL.PASS,
  },
});

/* =========================
   EMAIL REGISTRO
========================= */
const emailRegistro = async ({ email, nombre, token }) => {
  try {
    const info = await transport.sendMail({
      from: "ferreteria.com <no-reply@ferreteria.com>",
      to: email,
      subject: "Confirma tu cuenta",
      html: `
        <p>Hola ${nombre}, confirma tu cuenta.</p>
        <p>Haz clic en el siguiente enlace:</p>
        <p>
          <a href="${env.BACKEND_URL}/auth/confirmar/${token}">
            Confirmar cuenta
          </a>
        </p>
        <p>Si no creaste esta cuenta, ignora este mensaje.</p>
      `,
    });

    logger.info({
      message: "Correo de registro enviado",
      email,
      messageId: info.messageId,
    });
  } catch (error) {
    logger.error({
      message: "Error al enviar correo de registro",
      error: error.message,
    });
  }
};

/* =========================
   EMAIL RESET PASSWORD
========================= */
const emailOlvidePassword = async ({ email, nombre, token }) => {
  try {
    const info = await transport.sendMail({
      from: "ferreteria.com <no-reply@ferreteria.com>",
      to: email,
      subject: "Reestablece tu contraseña",
      html: `
        <p>Hola ${nombre}, solicitaste cambiar tu contraseña.</p>
        <p>Haz clic en el siguiente enlace:</p>
        <p>
          <a href="${env.BACKEND_URL}/auth/olvide-password/${token}">
            Reestablecer contraseña
          </a>
        </p>
        <p>Si no solicitaste esto, ignora este mensaje.</p>
      `,
    });

    logger.info({
      message: "Correo de recuperación enviado",
      email,
      messageId: info.messageId,
    });
  } catch (error) {
    logger.error({
      message: "Error al enviar correo de recuperación",
      error: error.message,
    });
  }
};

export { emailRegistro, emailOlvidePassword };
