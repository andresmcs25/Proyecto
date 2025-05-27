import prisma from "../utils/prisma.js";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Por favor ingresa usuario y contraseña");
  }

  try {
    const userFound = await prisma.usuario.findFirst({ where: { email } });
    

    if (!userFound || userFound.password !== password) {
      return res.status(401).send("Usuario o contraseña incorrectos");
    }

    // Guardar sesión
    req.session.userId = userFound.idusuario;

    // Responder con éxito y ruta para redirigir
    return res.status(200).json({ message: "Login exitoso", redirectTo: "/home" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error del servidor");
  }
};

