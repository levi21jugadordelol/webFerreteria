// import type { APIRoute } from "astro";
// //import nodemailer from "nodemailer";

// import "dotenv/config";

// export const POST: APIRoute = async ({ request }) => {
//   const formData = await request.formData();
//   const name = formData.get("username") as string;
//   const email = formData.get("email") as string;
//   const message = formData.get("message") as string;
//   const numero = formData.get("phone") as string;

//   // 👇 Verifica que la API key se esté leyendo
//   console.log("RESEND_API_KEY:", import.meta.env.RESEND_API_KEY);

//   // Transporter con Resend SMTP
//   const transporter = nodemailer.createTransport({
//     host: "smtp.resend.com",
//     port: 465, // o 587
//     secure: true, // true para 465, false para 587
//     auth: {
//       user: "resend", // siempre es "resend"
//       pass: process.env.RESEND_API_KEY, // tu API key de Resend
//     },
//   });

//   try {
//     const info = await transporter.sendMail({
//       from: "onboarding@resend.dev", // remitente permitido (o tu dominio verificado)
//       to: "editor.taisei@gmail.com", // tu correo receptor
//       subject: `Nuevo mensaje de ${name}`,
//       html: `
//   <p><strong>Nombre:</strong> ${name}</p>
//   <p><strong>Email:</strong> ${email}</p>
//   <p><strong>Numero:</strong> ${numero}</p>
//   <p><strong>Mensaje:</strong></p>
//   <p>${message}</p>
// `,
//     });

//     console.log("Correo enviado:", info.messageId);

//     return new Response(JSON.stringify({ success: true, id: info.messageId }), {
//       status: 200,
//     });
//   } catch (error) {
//     console.error("Error al enviar:", error);
//     return new Response(JSON.stringify({ success: false, error }), {
//       status: 500,
//     });
//   }
// };
