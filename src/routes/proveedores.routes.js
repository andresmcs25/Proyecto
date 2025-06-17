import { Router } from "express";
import { isAuthenticated } from "../libs/isAuthenticated.js";
import { validateRole } from "../libs/validateRole.js";
import {
  renderProveedores,
  agregarProveedor,
  editarProveedor,
  activarProveedor,
  desactivarProveedor
} from "../controllers/proveedores.controller.js";

const router = Router();

router.get("/proveedores", isAuthenticated, validateRole(1, 2), renderProveedores);
router.post("/proveedores/agregar", isAuthenticated, validateRole(1, 2), agregarProveedor);
router.post("/proveedores/editar/:id", isAuthenticated, validateRole(1, 2), editarProveedor);
router.post('/proveedores/activar/:id', isAuthenticated, activarProveedor);
router.post('/proveedores/desactivar/:id', isAuthenticated, desactivarProveedor);

export default router;