import { Router } from "express";
import { isAuthenticated } from "../libs/isAuthenticated.js";
import { renderCategorias, agregarCategoria, editarCategoria, eliminarCategoria } from '../controllers/categorias.controller.js';

const router = Router();

router.get("/categorias", isAuthenticated, renderCategorias);
router.post('/categorias/agregar', isAuthenticated, agregarCategoria);
router.post('/categorias/editar/:id', isAuthenticated, editarCategoria);
router.post('/categorias/eliminar/:id', isAuthenticated, eliminarCategoria);


export default router;

