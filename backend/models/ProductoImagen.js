import { DataTypes } from "sequelize";
import db from "../config/db.js";

const ProductoImagen = db.define(
  "producto_imagen",
  {
    id_imagen: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "producto_imagenes",
    timestamps: false,
  }
);

export default ProductoImagen;
