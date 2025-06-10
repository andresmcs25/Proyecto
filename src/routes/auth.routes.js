import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { loginUser, logoutUser } from "../controllers/auth.controller.js";

const router = Router();

// Utilidad para resolver __dirname (ya que en ES Modules no existe directamente)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/login", (req, res) => {

  res.render("login");
});
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/logout", logoutUser);

export default router;
