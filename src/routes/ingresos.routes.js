import { Router } from "express";
import { isAuthenticated } from "../libs/isAuthenticated.js";
import { renderIngresos, crearCompra, renderDetalleCompra } from "../controllers/ingresos.controller.js";

const router = Router();

// Ruta para mostrar la vista de ingresos
router.get("/ingresos", isAuthenticated, renderIngresos);

// Ruta para agregar una nueva compra
router.post("/ingresos/agregar", isAuthenticated, crearCompra);

// Ruta para mostrar los detalles de una compra
router.get("/ingresos/detalle/:id", isAuthenticated, renderDetalleCompra);

export default router;
