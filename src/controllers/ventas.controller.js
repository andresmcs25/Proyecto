import prisma from "../utils/prisma.js";

export const renderVentas = async (req, res) => {
    try {
        const user = req.session.userId ? await prisma.usuario.findUnique({
            where: { id_usuario: req.session.userId }
        }) : null;
        
        const ventas = await prisma.venta.findMany({ 
            include: {
                tercero: { select: { nombre_razon_social: true }},
                usuario: { select: { nombre_completo: true }}
            }
        });

        res.render("ventas", { 
            user, 
            pageTitle: "Ventas - NeoPOS", 
            activeMenu: { ventas : true },
            ventas
        });
    } catch (error) {
        console.error("Error al cargar la página de ventas:", error);
        res.status(500).send("Error en el servidor");
    }
};