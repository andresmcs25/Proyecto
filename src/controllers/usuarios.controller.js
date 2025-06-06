import prisma from "../utils/prisma.js";

export const renderUsuarios = async(req, res) => {

    const userId= req.session.userId

try {
        // Obtener datos del usuario actual
        const userFound = await prisma.usuario.findUnique({
            where: { id_usuario: userId },
            include: {rol_usuario: true}
        });

        const userRol = await prisma.rol_usuario.findUnique({
            where: { id_rol_usuario: userFound.id_rol_usuario }
        });

        const user = {
            nombre: userFound.nombre_completo,
            rol: userRol.nombre_rol,
        };

        // Obtener todos los usuarios de la base de datos
        const usuarios = await prisma.usuario.findMany({
            include: {rol_usuario: true}
        });

        const rol = userFound.rol_usuario.nombre_rol; // Extraer el rol

        res.render("usuarios", {
            pageTitle: "Usuarios - NeoPOS",
            user,
            usuarios, // Enviar la lista de usuarios a la vista
            activeMenu: { administracion: true, usuarios: true }
        });

    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).send("Error interno del servidor");
    }
};
export const toggleUsuarioActivo = async (req, res) => {
    const { userId } = req.params;
    const { activo } = req.body;

    try {
        await prisma.usuario.update({
            where: { id_usuario: parseInt(userId) },
            data: { activo }
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error al actualizar el estado:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
export const eliminarUsuario = async (req, res) => {
    const { userId } = req.params;

    try {
        await prisma.usuario.delete({
            where: { id_usuario: parseInt(userId) }
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
