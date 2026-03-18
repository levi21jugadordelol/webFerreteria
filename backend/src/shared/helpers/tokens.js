import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

const generarJWT = (admin) => {
  return jwt.sign(
    {
      id_administrador: admin.id_administrador,
      nombre: admin.nombre,
      rol: admin.rol,
    },
    env.JWT_SECRET,
    { expiresIn: "1d" },
  );
};

export { generarJWT };
