import { DataTypes } from "sequelize";
import db from "../../config/db.js";

const Menu = db.define(
  "menu",
  {
    id_menu: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    tipo: {
      type: DataTypes.STRING,
      defaultValue: "interno",
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
    tableName: "menu",
    timestamps: false,
  },
);

export default Menu;
