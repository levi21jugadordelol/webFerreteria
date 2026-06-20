import logger from "../../shared/logger/logger.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";

import {
  obtenerEstadisticas,
  obtenerActividad,
  ventasPorDia,
  ventasPorMes,
  obtenerKPIs,
} from "./dashboard.service.js";

export const estadisticasDashboard = asyncHandler(async (req, res) => {
  const { desde, hasta } = req.query;

  logger.info({
    message: "Fetching dashboard statistics",
    filtros: { desde, hasta },
    user: req.admin?.id_administrador,
  });

  const [stats, ventasDia, ventasMes, actividad] = await Promise.all([
    obtenerEstadisticas({ desde, hasta }),
    ventasPorDia(desde, hasta),
    ventasPorMes(),
    obtenerActividad(8, 0),
  ]);

  const kpis = await obtenerKPIs(ventasDia);

  return res.success({
    data: {
      stats,
      kpis,
      graficas: {
        ventasPorDia: ventasDia,
        ventasPorMes: ventasMes,
      },
      actividad,
    },
  });
});

export const actividadReciente = asyncHandler(async (req, res) => {
  const actividad = await obtenerActividad(8, 0);

  return res.success({
    data: actividad,
  });
});
