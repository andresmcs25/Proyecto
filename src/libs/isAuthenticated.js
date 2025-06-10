import prisma from '../utils/prisma.js';

export async function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    const userFound = await prisma.usuario.findUnique({
      where: { id_usuario: req.session.userId }
    });
    req.user = userFound;
    next();
  } else {
    res.redirect("/login");
  }
}