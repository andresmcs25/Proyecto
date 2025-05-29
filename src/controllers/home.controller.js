import prisma from "../utils/prisma.js";

export const renderHome = async(req, res) => {

    const userId= req.session.userId

    const userFound= await prisma.usuario.findUnique({
        where:{id_usuario: userId}
    })

    const userRol= await prisma.rol_usuario.findUnique({
        where:{id_rol_usuario: userFound.id_rol_usuario}
    })

    console.log(userRol)

    const user = {
        nombre: userFound.nombre_completo,
        rol: userRol.nombre_rol
    }
    res.render("home",{
        pageTitle: "Inicio - NeoPOS",
        user,
        activeMenu: { home: true }
    })
};