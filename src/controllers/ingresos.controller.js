import prisma from "../utils/prisma.js";    

export const renderIngresos = async (req, res) => {
    const userId = req.session.userId;

    const userFound = await prisma.usuario.findUnique({
        where: { id_usuario: userId }
    });
    const userRol = await prisma.rol_usuario.findUnique({
        where: { id_rol_usuario: userFound.id_rol_usuario }
    });
    const user = {
        nombre: userFound.nombre_completo,
        rol: userRol.nombre_rol,
        id_rol_usuario: userFound.id_rol_usuario
    };
    res.render("ingresos", {
        pageTitle: "Ingresos - NeoPOS",
        user,
        activeMenu: { ingresos: true }
    });
};