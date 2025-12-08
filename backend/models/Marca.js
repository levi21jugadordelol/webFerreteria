// 📦 models/Marca.js
import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Marca = db.define(
  "marca",
  {
    id_marca: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre_marca: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    url_logo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "marcas",
    timestamps: false,
  }
);

export default Marca;
