import { crearUpload } from "../../shared/middleware/upload.js";

const uploadProducto = crearUpload("uploads/productos");

export default uploadProducto;
