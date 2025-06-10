import { Router } from "express";
import { isAuthenticated } from "../libs/isAuthenticated.js";
import { renderVentas } from "../controllers/ventas.controller.js";
import { generarFacturaPDF } from "../controllers/ventas.controller.js";

const router = Router();

router.get("/ventas", isAuthenticated, renderVentas);
router.get("/ventas/pdf/:idVenta", generarFacturaPDF);

export default router;