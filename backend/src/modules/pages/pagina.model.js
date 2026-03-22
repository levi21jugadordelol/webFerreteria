import { DataTypes } from "sequelize";
import db from "../../config/db.js";

const Pagina = db.define(
  "pagina",
  {
    id_pagina: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    contenido: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    /* SEO */

    meta_title: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    meta_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    meta_keywords: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    imagen_portada: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    /* TEMPLATE */

    template: {
      type: DataTypes.STRING,
      defaultValue: "default",
    },
    secciones: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "paginas",
    timestamps: true,
  },
);

export default Pagina;
