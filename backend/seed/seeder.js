import { exit } from "node:process";
import categorias from "./categorias.js";
import precios from "./precios.js";
import usuarios from "./usuarios.js";

import db from "../config/db.js";
import { Categoria, Precio, Usuario } from "../models/index.js";

const importarDatos = async () => {
  try {
    //autenticar
    await db.authenticate();

    //generar las columnas
    await db.sync();

    //insertamos los datos
    await Categoria.bulkCreate(categorias);

    await Precio.bulkCreate(precios);

    await Usuario.bulkCreate(usuarios);
    console.log("datos importados correctamente");
    exit(); //este exit es cuando se temrina correctamente
  } catch (error) {
    console.log(error);
    exit(1); //se pone el 1 cuando sucede un error
  }
};

const eliminarDatos = async () => {
  try {
    await db.sync({ force: true });
    console.log("datos eliminados correctamente");
    exit();
  } catch (error) {
    console.log(error);
    exit(1);
  }
};

//este codigo tiene relacion con el scrip que esta en package,json "db:importar": "node ./seed/seeder.js -i"
if (process.argv[2] === "-i") {
  importarDatos();
}

if (process.argv[2] === "-e") {
  eliminarDatos();
}
