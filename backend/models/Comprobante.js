import { DataTypes } from "sequelize";
import db from "../config/db.js";

const ComprobantePago = db.define(
  "comprobante_pago",
  {
    id_comprobante: {
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
    url_imagen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha_hora: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    estado_validacion: {
      type: DataTypes.ENUM("pendiente", "validado", "rechazado", "vencido"),
      allowNull: false,
      defaultValue: "pendiente",
    },

    // 👇 NUEVO
    fecha_validacion_pago: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "comprobantes_pago",
    timestamps: false,
  },
);

export default ComprobantePago;
