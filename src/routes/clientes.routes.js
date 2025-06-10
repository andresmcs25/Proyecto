import { Router } from "express";
import { isAuthenticated } from "../libs/isAuthenticated.js";
import { renderClientes } from "../controllers/clientes.controller.js";
import { toggleTerceroActivo, crearTercero } from "../controllers/clientes.controller.js";

const router = Router();

router.get("/clientes", isAuthenticated, renderClientes);
router.patch("/clientes/:userTercero/toggle", toggleTerceroActivo);
router.post("/clientes/nuevo", crearTercero);

export default router;