import fs from "fs";
import csv from "csv-parser";
import Producto from "../producto.model.js";
import db from "../../../config/db.js";
import logger from "../../../shared/logger/logger.js";

async function importar() {
  try {
    await db.authenticate();

    logger.info({ message: "✅ DB conectada" });

    const productos = [];

    fs.createReadStream("scripts/productos.csv")
      .pipe(csv())
      .on("data", (row) => {
        productos.push({
          nombre_producto: row.nombre,
          descripcion: row.descripcion,
          precio: Number(row.precio),
          stock: Number(row.stock),
          categoria_id: Number(row.categoria_id),
          marca_id: Number(row.marca_id),
          url_imagen: row.imagen ? `productos/${row.imagen}` : null,
        });
      })
      .on("end", async () => {
        try {
          for (const p of productos) {
            await Producto.create(p);

            logger.debug({
              message: "Producto creado",
              nombre: p.nombre_producto,
            });
          }

          logger.info({
            message: "🎉 Importación finalizada",
            total: productos.length,
          });

          process.exit();
        } catch (error) {
          logger.error({
            message: "❌ Error guardando productos",
            error: error.message,
          });
          process.exit(1);
        }
      });
  } catch (error) {
    logger.error({
      message: "❌ Error inicializando importación",
      error: error.message,
    });
    process.exit(1);
  }
}

importar();
