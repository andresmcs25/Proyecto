import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { isAuthenticated } from "../libs/isAuthenticated.js";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


router.get("/home", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../views/home.html"));
});



export default router;
