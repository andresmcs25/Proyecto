import { Router } from "express";
import { isAuthenticated } from "../libs/isAuthenticated.js";
import { renderProductos } from "../controllers/productos.controller.js";
import { crearProducto } from "../controllers/productos.controller.js";
import { editarProducto } from "../controllers/productos.controller.js";
import { eliminarProducto } from "../controllers/productos.controller.js";

const router = Router();


router.get("/productos", isAuthenticated,renderProductos);
router.post("/productos/nuevo", isAuthenticated, crearProducto);
router.post("/productos/editar/:id", isAuthenticated, editarProducto);
router.post("/productos/eliminar/:id", isAuthenticated, eliminarProducto);


export default router;
