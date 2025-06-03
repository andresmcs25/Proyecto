import { Router } from "express";
import { isAuthenticated } from "../libs/isAuthenticated.js";
import { renderUsuarios } from "../controllers/usuarios.controller.js";
import { toggleUsuarioActivo } from "../controllers/usuarios.controller.js";
import { eliminarUsuario } from "../controllers/usuarios.controller.js";

const router = Router();

router.get("/usuarios", isAuthenticated, renderUsuarios);
router.patch("/usuarios/:userId/toggle", toggleUsuarioActivo);
router.delete("/usuarios/:userId/delete", eliminarUsuario);


export default router;