import { DataTypes } from "sequelize";
import db from "../../config/db.js";

const ProductoTab = db.define(
  "producto_tab",
  {
    id_tab: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    orden: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "producto_tabs",
    timestamps: false,
  },
);

export default ProductoTab;
