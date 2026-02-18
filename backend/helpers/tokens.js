import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import chalk from "chalk";

dotenv.config(); // 🔥 Garantiza que el .env esté cargado aquí

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.log(chalk.bgRed.white("❌ JWT_SECRET no está definido en backend"));
} else {
  console.log(chalk.green("🔐 JWT_SECRET cargado correctamente en backend"));
}

const generarJWT = (admin) => {
  console.log(chalk.cyan("🛠️ Firmando token con SECRET:"), JWT_SECRET);

  return jwt.sign(
    {
      id_administrador: admin.id_administrador,
      nombre: admin.nombre,
      rol: admin.rol,
    },
    JWT_SECRET,
    { expiresIn: "1d" },
  );
};

export { generarJWT };
