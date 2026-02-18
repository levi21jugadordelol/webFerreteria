// models/SiteSetting.js
import { DataTypes } from "sequelize";
import db from "../config/db.js";

const SiteSetting = db.define(
  "site_setting",
  {
    id_site_setting: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    value: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
  },
  {
    tableName: "site_settings",
    timestamps: true,
  },
);

export default SiteSetting;
