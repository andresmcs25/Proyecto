import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { isAuthenticated } from "../libs/isAuthenticated.js";
import { renderHome } from "../controllers/home.controller.js";

const router = Router();




router.get("/home", isAuthenticated,renderHome)



export default router;
