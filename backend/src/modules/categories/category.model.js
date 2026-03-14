import { DataTypes } from "sequelize";
import db from "../../config/db.js";

const Categoria = db.define(
  "categoria",
  {
    id_categoria: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre_categoria: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // 🖼️ Imagen opcional
    url_imagen: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null, // 🔹 si no sube imagen, queda vacío sin error
    },
  },
  {
    tableName: "categorias",
    timestamps: false, // no createdAt / updatedAt
  },
);

export default Categoria;
