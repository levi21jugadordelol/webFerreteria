import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const emailRegistro = async (datos) => {
  try {
    console.log("📧 Verificando variables ENV:", {
      EMAIL_HOST: process.env.EMAIL_HOST,
      EMAIL_PORT: process.env.EMAIL_PORT,
      EMAIL_USER: process.env.EMAIL_USER,
      EMAIL_PASS: process.env.EMAIL_PASS ? "✅ cargada" : "❌ faltante",
    });

    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
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
        <p><a href="${process.env.BACKEND_URL}:${
        process.env.PORT ?? 3000
      }/auth/confirmar/${token}">Confirmar cuenta</a></p>
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
    console.log("📧 Verificando variables ENV:", {
      EMAIL_HOST: process.env.EMAIL_HOST,
      EMAIL_PORT: process.env.EMAIL_PORT,
      EMAIL_USER: process.env.EMAIL_USER,
      EMAIL_PASS: process.env.EMAIL_PASS ? "✅ cargada" : "❌ faltante",
    });

    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const { email, nombre, token } = datos;

    const info = await transport.sendMail({
      from: "ferreteria.com <no-reply@ferreteria.com>",
      to: email,
      subject: "Reestablece tu password en bienesRaices.com",
      html: `
        <p>Hola ${nombre},ha solicitado reestablecer tu password en<strong>bienesRaices.com</strong>.</p>
        <p>sigue al sgte enlace para generar un password nuevo:</p>
        <p><a href="${process.env.BACKEND_URL}:${
        process.env.PORT ?? 3000
      }/auth/olvide-password/${token}">reestablecer password</a></p>
        <p>Si tú no solicitaste el cambio de password, puedes ignorar este mensaje.</p>
      `,
    });

    console.log("✅ Correo enviado:", info.messageId);
  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
  }
};

export { emailRegistro, emailOlvidePassword };
