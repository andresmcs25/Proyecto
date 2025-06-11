import cors from "cors";
import "dotenv/config";
import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

// routes
import authRouter from "./routes/auth.routes.js";
import homeRouter from "./routes/home.routes.js";
import productoRouter from "./routes/productos.routes.js";
import categoriasRouter from "./routes/categorias.routes.js";
import ingresosRouter from "./routes/ingresos.routes.js";
import usuariosRouter from "./routes/usuarios.routes.js";
import ventasRouter from "./routes/ventas.routes.js";
import clientesRouter from "./routes/clientes.routes.js";
import proveedoresRouter from "./routes/proveedores.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use('/js', express.static(path.join(__dirname, 'js')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors({
  origin: "*"
}));


app.use(session({
  secret: "una_clave_secreta_cualquiera",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));


app.use("/", authRouter);
app.use("/", homeRouter);
app.use("/", productoRouter);
app.use("/", categoriasRouter);
app.use("/", ingresosRouter);
app.use("/", usuariosRouter);
app.use("/", ventasRouter);
app.use("/", clientesRouter);
app.use("/", proveedoresRouter);



export default app;
