import { DataTypes } from "sequelize";
import db from "../../config/db.js";

const Administrador = db.define(
  "administradores",
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
      defaultValue: "admin",
    },
  },
  {
    timestamps: true,

    // ✅ SIN hooks (IMPORTANTE)
    scopes: {
      sinHash: {
        attributes: { exclude: ["hash"] },
      },
    },
  },
);

export default Administrador;
