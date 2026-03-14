import { DataTypes } from "sequelize";
import db from "../config/db.js";

const HeroSlide = db.define(
  "hero_slide",
  {
    id_hero: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // 🔤 Texto principal (opcional según layout)
    titulo1: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    titulo2: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // 🖼 Imagen (obligatoria siempre)
    imagen: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    // 🎨 Tipo de layout visual
    tipo_layout: {
      type: DataTypes.ENUM(
        "banner", // solo imagen
        "text-left", // texto izquierda
        "text-right", // texto derecha
        "centered", // texto centrado
        "triple", // 👈 nuevo layout
      ),
      allowNull: false,
      defaultValue: "banner",
    },

    // 🔘 Control de botón
    mostrar_boton: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    boton_texto: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    boton_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    link_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    // 🟢 Estado
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    // 🔢 Orden del carrusel
    orden: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "hero_slides",
    timestamps: true,
  },
);

export default HeroSlide;
