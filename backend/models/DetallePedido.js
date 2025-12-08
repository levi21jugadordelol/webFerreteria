import { DataTypes } from "sequelize";
import db from "../config/db.js";

const DetallePedido = db.define(
  "detalle_pedido",
  {
    id_detalle: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pedido_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "pedidos",
        key: "id_pedido",
      },
      onDelete: "CASCADE",
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "productos",
        key: "id_producto",
      },
      onDelete: "CASCADE",
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "detalles_pedido",
    timestamps: false,
  }
);

export default DetallePedido;
