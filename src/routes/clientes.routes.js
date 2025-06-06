import { Router } from "express";
import { isAuthenticated } from "../libs/isAuthenticated.js";
import { renderClientes } from "../controllers/clientes.controller.js";
import { toggleTerceroActivo } from "../controllers/clientes.controller.js";

const router = Router();

router.get("/clientes", isAuthenticated, renderClientes);
router.patch("/clientes/:userTercero/toggle", toggleTerceroActivo)

export default router;