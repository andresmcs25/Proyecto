import { Router } from "express";
import { isAuthenticated } from "../libs/isAuthenticated.js";
import { renderCategorias, agregarCategoria, editarCategoria, activarCategoria, desactivarCategoria } from '../controllers/categorias.controller.js';

const router = Router();

router.get("/categorias", isAuthenticated, renderCategorias);
router.post('/categorias/agregar', isAuthenticated, agregarCategoria);
router.post('/categorias/editar/:id', isAuthenticated, editarCategoria);
router.post('/categorias/activar/:id', isAuthenticated, activarCategoria);
router.post('/categorias/desactivar/:id', isAuthenticated, desactivarCategoria);


export default router;

