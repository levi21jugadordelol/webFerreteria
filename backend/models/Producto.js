// 📦 models/Producto.js
import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Producto = db.define(
  "producto",
  {
    id_producto: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre_producto: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    url_imagen: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    // 🔹 Relación con la categoría
    categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // puede no tener categoría
      references: {
        model: "categorias",
        key: "id_categoria",
      },
    },

    // 🔹 Relación con el administrador
    administrador_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Dentro del modelo Producto:

    marca_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "marcas", // 👈 nombre real de tabla
        key: "id_marca",
      },
    },
    es_destacado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    es_temporada: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    temporada_inicio: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    temporada_fin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "productos",
    timestamps: false,
  }
);

export default Producto;
