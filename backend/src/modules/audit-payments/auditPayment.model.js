import { DataTypes } from "sequelize";
import db from "../../config/db.js";

const PagoAuditoria = db.define(
  "pago_auditoria",
  {
    id_auditoria: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    comprobante_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    accion: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    admin_usuario: {
      type: DataTypes.STRING,
    },

    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "pagos_auditoria",
    timestamps: false,
  },
);

export default PagoAuditoria;
