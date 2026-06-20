import { DataTypes } from "sequelize";
import db from "../../config/db.js";

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

    tipo_documento: {
      type: DataTypes.ENUM("DNI", "RUC", "CE", "SIN_DOCUMENTO"),
      allowNull: false,
      defaultValue: "SIN_DOCUMENTO",
    },

    numero_documento: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    direccion_envio: {
      type: DataTypes.STRING(255),
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
    tableName: "pedidos",
    timestamps: false,
  },
);

export default Pedido;
