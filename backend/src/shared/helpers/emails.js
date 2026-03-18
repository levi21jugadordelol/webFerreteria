import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const emailRegistro = async (datos) => {
  try {
    const transport = nodemailer.createTransport({
      host: env.EMAIL.HOST,
      port: env.EMAIL.PORT,
      auth: {
        user: env.EMAIL.USER,
        pass: env.EMAIL.PASS,
      },
    });

    const { email, nombre, token } = datos;

    const info = await transport.sendMail({
      from: "bienesRaices.com <no-reply@bienesraices.com>",
      to: email,
      subject: "Confirma tu cuenta en bienesRaices.com",
      html: `
        <p>Hola ${nombre}, comprueba tu cuenta en <strong>bienesRaices.com</strong>.</p>
        <p>Tu cuenta ya está lista. Confírmala en el siguiente enlace:</p>
        <p><a href="${env.BACKEND_URL}:${env.PORT}/auth/confirmar/${token}">
        Confirmar cuenta</a></p>
        <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje.</p>
      `,
    });

    console.log("✅ Correo enviado:", info.messageId);
  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
  }
};

const emailOlvidePassword = async (datos) => {
  try {
    const transport = nodemailer.createTransport({
      host: env.EMAIL.HOST,
      port: env.EMAIL.PORT,
      auth: {
        user: env.EMAIL.USER,
        pass: env.EMAIL.PASS,
      },
    });

    const { email, nombre, token } = datos;

    const info = await transport.sendMail({
      from: "ferreteria.com <no-reply@ferreteria.com>",
      to: email,
      subject: "Reestablece tu password en bienesRaices.com",
      html: `
        <p>Hola ${nombre}, ha solicitado reestablecer tu password en <strong>bienesRaices.com</strong>.</p>
        <p>Sigue el siguiente enlace para generar un password nuevo:</p>
        <p><a href="${env.BACKEND_URL}:${env.PORT}/auth/olvide-password/${token}">
        Reestablecer password</a></p>
        <p>Si tú no solicitaste el cambio, puedes ignorar este mensaje.</p>
      `,
    });

    console.log("✅ Correo enviado:", info.messageId);
  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
  }
};

export { emailRegistro, emailOlvidePassword };
