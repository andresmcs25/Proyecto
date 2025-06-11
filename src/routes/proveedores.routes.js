import { Router } from "express";
import { isAuthenticated } from "../libs/isAuthenticated.js";
import { validateRole } from "../libs/validateRole.js";
import {
  renderProveedores,
  agregarProveedor,
  editarProveedor,
  eliminarProveedor
} from "../controllers/proveedores.controller.js";

const router = Router();

router.get("/proveedores", isAuthenticated, validateRole(1, 2), renderProveedores);
router.post("/proveedores/agregar", isAuthenticated, validateRole(1, 2), agregarProveedor);
router.post("/proveedores/editar/:id", isAuthenticated, validateRole(1, 2), editarProveedor);
router.post("/proveedores/eliminar/:id", isAuthenticated, validateRole(1, 2), eliminarProveedor);

export default router;