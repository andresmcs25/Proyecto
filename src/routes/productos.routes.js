import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { isAuthenticated } from "../libs/isAuthenticated.js";
import { renderProductos } from "../controllers/productos.controller.js";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


router.get("/productos", isAuthenticated,renderProductos);



export default router;
