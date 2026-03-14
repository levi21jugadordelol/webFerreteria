import { DataTypes } from "sequelize";
import db from "../config/db.js";

const ProductoCaracteristica = db.define(
  "producto_caracteristica",
  {
    id_caracteristica: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    tab_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    titulo: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    valor: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    orden: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "producto_caracteristicas",
    timestamps: false,
  },
);

export default ProductoCaracteristica;
