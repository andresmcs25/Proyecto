import { Router } from "express";
import { isAuthenticated } from "../libs/isAuthenticated.js";
import { renderVentas } from "../controllers/ventas.controller.js";

const router = Router();

router.get("/ventas", isAuthenticated, renderVentas);

export default router;