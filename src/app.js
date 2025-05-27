import cors from "cors";
import "dotenv/config";
import express from "express";
import session from "express-session";

// routes
import authRouter from "./routes/auth.routes.js";
import homeRouter from "./routes/home.routes.js";



const app = express();

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




export default app;
