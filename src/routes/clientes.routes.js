import { Router } from "express";
import { isAuthenticated } from "../libs/isAuthenticated.js";
import { renderClientes, editarTercero } from "../controllers/clientes.controller.js";
import { toggleTerceroActivo, crearTercero } from "../controllers/clientes.controller.js";
import { validateRole } from "../libs/validateRole.js";


const router = Router();

router.get("/clientes", isAuthenticated, validateRole(1, 2), renderClientes);
router.patch("/clientes/:userTercero/toggle", isAuthenticated, validateRole(1, 2), toggleTerceroActivo);
router.post("/clientes/nuevo", isAuthenticated, validateRole(1, 2), crearTercero);
router.put("/clientes/:clienteId/editar", isAuthenticated, validateRole(1,2 ), editarTercero);

export default router;