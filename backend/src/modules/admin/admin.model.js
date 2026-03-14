import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import db from "../../../src/config/db.js";

const Administrador = db.define(
  "administradores", // nombre de la tabla
  {
    id_administrador: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {
      type: DataTypes.STRING,
      defaultValue: "admin", // por defecto, ya que no hay otros roles
    },
  },
  {
    hooks: {
      beforeCreate: async (admin) => {
        const salt = await bcrypt.genSalt(10);
        admin.hash = await bcrypt.hash(admin.hash, salt);
      },
    },
    scopes: {
      sinHash: {
        attributes: { exclude: ["hash"] },
      },
    },
  },
);

// Método de instancia para verificar contraseñas
Administrador.prototype.verificarPassword = function (password) {
  return bcrypt.compareSync(password, this.hash);
};

export default Administrador;
