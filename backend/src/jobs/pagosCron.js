import cron from "node-cron";

import PagoService from "../modules/payments/payment.service.js";
import logger from "../shared/logger/logger.js";

// Evita duplicación con nodemon
if (!global.cronPagosIniciado) {
  global.cronPagosIniciado = true;

  cron.schedule("*/10 * * * *", async () => {
    try {
      logger.info({
        event: "PAYMENT_EXPIRATION_JOB_STARTED",
      });

      await PagoService.expirarComprobantes();

      logger.info({
        event: "PAYMENT_EXPIRATION_JOB_FINISHED",
      });
    } catch (error) {
      logger.error({
        event: "PAYMENT_EXPIRATION_JOB_ERROR",
        error: error.message,
      });
    }
  });

  logger.info({
    event: "PAYMENT_EXPIRATION_JOB_INITIALIZED",
  });
}
