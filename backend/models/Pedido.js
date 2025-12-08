import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Pedido = db.define(
  "pedido",
  {
    id_pedido: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre_comprador: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dni_comprador: {
      type: DataTypes.STRING(15), // suficiente para DNI o RUC
      allowNull: false,
    },
    telefono_comprador: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    fecha_hora: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    estado_pedido: {
      type: DataTypes.ENUM("pendiente", "pagado", "entregado", "cancelado"),
      allowNull: false,
      defaultValue: "pendiente",
    },
    total_pedido: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "pedidos", // nombre de la tabla en plural
    timestamps: false, // si no usas createdAt/updatedAt
  }
);

export default Pedido;
