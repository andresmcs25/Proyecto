import prisma from "../utils/prisma.js";
import moment from "moment";

export const renderClientes = async (req, res) => {

    const userId = req.session.userId
    
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

        const clientes = await prisma.tercero.findMany();

        clientes.forEach(cliente => {
            cliente.fecha_registro = moment(cliente.fecha_registro).format("DD/MM/YYYY HH:mm");
        });

        
            res.render("clientes", { 
            user, 
            pageTitle: "Clientes - NeoPOS", 
            activeMenu: { cliente : true },
            clientes
        });
    } catch (error) {
        console.error("Error al cargar la página de terceros:", error);
        res.status(500).send("Error en el servidor");
    }
};
export const toggleTerceroActivo = async (req, res) => {
    const { userTercero } = req.params;
    const { activo } = req.body;

    try {
        await prisma.tercero.update({
            where: { id_tercero: parseInt(userTercero) },
            data: { activo }
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error al actualizar el estado:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};