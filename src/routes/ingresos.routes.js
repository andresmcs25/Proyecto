import { Router } from "express";
import { isAuthenticated } from "../libs/isAuthenticated.js";
import { renderIngresos } from "../controllers/ingresos.controller.js";

const router = Router();

// Ruta para mostrar la vista de ingresos
router.get("/ingresos", isAuthenticated, renderIngresos);

export default router;