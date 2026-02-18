import fs from "fs";
import csv from "csv-parser";
import Producto from "../models/Producto.js";
import db from "../config/db.js";

async function importar() {
  await db.authenticate();
  console.log("✅ DB conectada");

  fs.createReadStream("scripts/productos.csv")
    .pipe(csv())
    .on("data", async (row) => {
      try {
        await Producto.create({
          nombre_producto: row.nombre,
          descripcion: row.descripcion,
          precio: Number(row.precio),
          stock: Number(row.stock),
          categoria_id: Number(row.categoria_id),
          marca_id: Number(row.marca_id),
          url_imagen: row.imagen ? `productos/${row.imagen}` : null,
        });

        console.log("✔ Producto creado:", row.nombre);
      } catch (err) {
        console.error("❌ Error:", row.nombre, err.message);
      }
    })
    .on("end", () => {
      console.log("🎉 Importación finalizada");
      process.exit();
    });
}

importar();
