import prisma from "../utils/prisma.js";
import moment from "moment";

export const renderClientes = async (req, res) => {

    const userId = req.session.userId

    async function getUserData(req) {
    const userId = req.session.userId;
    let userData = null;
}
    
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
            id_rol_usuario: userFound.id_rol_usuario
        };

        const clientes = await prisma.tercero.findMany();

        clientes.forEach(cliente => {
            cliente.fecha_registro = moment(cliente.fecha_registro).format("DD/MM/YYYY HH:mm");
        });

        const tiposTercero = [
            { tipo_tercero: "Cliente" },
            { tipo_tercero: "Proveedor" },
            { tipo_tercero: "Otro" }
        ];
        
        res.render("clientes", {  
            pageTitle: "Clientes - NeoPOS",
            user,
            clientes,
            tiposTercero,
            activeMenu: { clientes: true },
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
export const crearTercero = async (req, res) => {
    try {
        const {
            tipo_tercero,
            nombre_razon_social,
            tipo_documento_identidad,
            numero_documento_identidad,
            direccion,
            telefono_contacto,
            email
        } = req.body;

        if (!tipo_tercero || !nombre_razon_social || !tipo_documento_identidad || !numero_documento_identidad || !direccion || !telefono_contacto || !email) {
            return res.status(400).json({
                success: false,
                message: "Faltan campos obligatorios"
            });
        }

        const existingTercero = await prisma.tercero.findFirst({
            where: { numero_documento_identidad: numero_documento_identidad }
        });

        if (existingTercero) {
            return res.status(400).json({
                success: false,
                message: "Tercero ya existe"
            });
        }

        const nuevoTercero = await prisma.tercero.create({
            data: {
                tipo_tercero,
                nombre_razon_social,
                tipo_documento_identidad,
                numero_documento_identidad,
                direccion,
                telefono_contacto,
                email
            }
        });

        return res.status(201).json({
            success: true,
            message: "Tercero creado con exito",
            tercero: nuevoTercero
        });
    }catch(error){
        console.error("Error al crear el tercero", error);

        if(error.code === 'P2002'){
            return res.status(400).json({
                success: false,
                message: "Tercero ya existe"
            });
        }

        res.status(500).json({
            success: false,
            message: "Error interno del servidor" + error.message
        });
    }
}
