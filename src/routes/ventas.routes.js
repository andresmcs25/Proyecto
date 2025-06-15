import { Router } from "express";
import { isAuthenticated } from "../libs/isAuthenticated.js";
import { renderVentas, regiVentas } from "../controllers/ventas.controller.js";
import { generarFacturaPDF } from "../controllers/ventas.controller.js";
import { validateRole } from "../libs/validateRole.js";


const router = Router();

router.get("/ventas", isAuthenticated, validateRole(1, 2), renderVentas);
router.post("/ventas", isAuthenticated, validateRole(1, 2), regiVentas);
router.get("/ventas/pdf/:idVenta", isAuthenticated, validateRole(1, 2), generarFacturaPDF);


export default router;