import dotenv from "dotenv";
import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import chalk from "chalk";
import Administrador from "./admin.model.js";

//const JWT_SECRET = process.env.JWT_SECRET || "secreto_admin";
dotenv.config(); // 🔥 Asegura que el .env se cargue aquí

// 🟢 Endpoint de prueba (verifica conexión del login)
const formularioLogin = (req, res) => {
  res.json({ mensaje: "Login del administrador - OK" });
};

// 🟢 Autenticar administrador
const autenticar = async (req, res) => {
  console.log(chalk.yellow("🚪 Entrando a autenticar()"));
  console.log(chalk.gray("📥 Datos recibidos:"), req.body);

  try {
    await check("correo").isEmail().run(req);
    await check("password").notEmpty().run(req);

    const resultado = validationResult(req);
    if (!resultado.isEmpty()) {
      return res.status(400).json({ errores: resultado.array() });
    }

    const { correo, password } = req.body;

    const admin = await Administrador.findOne({ where: { correo } });

    if (!admin) {
      return res.status(404).json({ msg: "El administrador no existe" });
    }

    const esValido = await bcrypt.compare(password, admin.hash);

    if (!esValido) {
      return res.status(401).json({ msg: "La contraseña es incorrecta" });
    }

    // 🔥 Lee el secret en el momento de usarlo
    const secret = process.env.JWT_SECRET;

    console.log(chalk.cyan("SECRET BACKEND:"), secret);

    const token = jwt.sign(
      {
        id_administrador: admin.id_administrador,
        nombre: admin.nombre,
        rol: admin.rol,
      },
      secret,
      { expiresIn: "1d" },
    );

    console.log(chalk.green("TOKEN GENERADO BACKEND:"), token);

    res.cookie("_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return res.json({
      msg: "Inicio de sesión exitoso",
    });
  } catch (error) {
    console.error(
      chalk.bgRed.white("💥 Error en autenticar():"),
      error.message,
    );
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

// 🟢 Endpoint de prueba (formulario de registro)
const formularioRegistro = (req, res) => {
  res.json({ mensaje: "Registro de administrador - OK" });
};

// 🟢 Registrar administrador
const registrar = async (req, res) => {
  console.log(chalk.cyan("🛠️ Entrando en registrar() con datos:"), req.body);

  try {
    await check("nombre").notEmpty().run(req);
    await check("correo").isEmail().run(req);
    await check("password").isLength({ min: 6 }).run(req);
    console.log(chalk.yellow("✅ Validaciones ejecutadas"));

    const resultado = validationResult(req);
    if (!resultado.isEmpty()) {
      console.log(chalk.red("❌ Errores de validación:"), resultado.array());
      return res.status(400).json({ errores: resultado.array() });
    }

    const { nombre, correo, password } = req.body;

    const existeAdmin = await Administrador.findOne({ where: { correo } });
    if (existeAdmin) {
      console.log(chalk.red("⚠️ El correo ya está registrado"));
      return res.status(400).json({ msg: "El correo ya está registrado" });
    }

    console.log(chalk.green("💾 Creando nuevo administrador..."));
    await Administrador.create({ nombre, correo, hash: password });

    console.log(chalk.greenBright("🎉 Administrador creado correctamente"));
    return res.status(201).json({
      msg: "Administrador registrado correctamente. Ya puedes iniciar sesión.",
    });
  } catch (error) {
    console.error(chalk.bgRed.white("💥 Error en registrar():"), error.message);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

// 🟢 Cerrar sesión
// 🟢 Cerrar sesión
const cerrarSesion = (req, res) => {
  res.clearCookie("_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json({
    ok: true,
    msg: "Sesión cerrada correctamente",
  });
};

export {
  formularioLogin,
  autenticar,
  formularioRegistro,
  registrar,
  cerrarSesion,
};
