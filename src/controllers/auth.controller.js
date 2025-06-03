import prisma from "../utils/prisma.js";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Por favor ingresa usuario y contraseña");
  }

  try {
    const userFound = await prisma.usuario.findFirst({ where: { email } });
    

    if (!userFound || userFound.password_hash !== password) {
      return res.status(401).send("Usuario o contraseña incorrectos");
    }

    await prisma.usuario.update({
      where: {id_usuario: userFound.id_usuario},
      data: {ultimo_acceso: new Date()}
    });
    
    // Guardar sesión
    req.session.userId = userFound.id_usuario;

    // Responder con éxito y ruta para redirigir
    return res.status(200).json({ message: "Login exitoso", redirectTo: "/home" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error del servidor");
  }
};

