import { Router } from "express";

import { isAuthenticated } from "../libs/isAuthenticated.js";
import { renderProductos } from "../controllers/productos.controller.js";
import { crearProducto } from "../controllers/productos.controller.js";
import { editarProducto } from "../controllers/productos.controller.js";
import { activarProducto } from "../controllers/productos.controller.js";
import { desactivarProducto } from "../controllers/productos.controller.js";
import { validateRole } from "../libs/validateRole.js";

const router = Router();

router.get("/productos", isAuthenticated, validateRole(1, 2), renderProductos);
router.post("/productos/nuevo", isAuthenticated, validateRole(1, 2), crearProducto);
router.post("/productos/editar/:id", isAuthenticated, validateRole(1, 2), editarProducto);
router.post("/productos/activar/:id", isAuthenticated, validateRole(1, 2), activarProducto);
router.post("/productos/desactivar/:id", isAuthenticated, validateRole(1, 2), desactivarProducto);

export default router;
