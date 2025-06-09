import prisma from "../utils/prisma.js";
import bcrypt from "bcryptjs";

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

        const roles = await prisma.rol_usuario.findMany();

        res.render("usuarios", {
            pageTitle: "Usuarios - NeoPOS",
            user,
            usuarios, // Enviar la lista de usuarios a la vista
            rol,
            roles,
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
export const crearUsuario = async (req, res) => {
    try {
        const { 
            nombre_completo, 
            tipo_documento_identidad, 
            numero_documento_identidad, 
            email, 
            telefono, 
            cargo_descripcion, 
            id_rol_usuario, 
            login_acceso, 
            password_hash 
        } = req.body;

        if (!nombre_completo || !email || !id_rol_usuario || !login_acceso || !password_hash) {
            return res.status(400).json({ 
                success: false, 
                message: "Faltan campos obligatorios" 
            });
        }

        const existingUser = await prisma.usuario.findFirst({
            where: {
                OR: [
                    { email: email },
                    { login_acceso: login_acceso }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "Ya existe un usuario con ese email o nombre de usuario" 
            });
        }

        // Cifrar la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password_hash, 12);

        // Crear usuario con relación a `rol_usuario`
        const nuevoUsuario = await prisma.usuario.create({
            data: {
                nombre_completo,
                tipo_documento_identidad,
                numero_documento_identidad,
                email,
                telefono,
                cargo_descripcion,
                login_acceso,
                password_hash: hashedPassword,
                rol_usuario: {
                    connect: { id_rol_usuario: Number(id_rol_usuario) }
                }
            }
        });

        res.status(201).json({ 
            success: true, 
            message: "Usuario creado exitosamente", 
            usuario: nuevoUsuario 
        });
    } catch (error) {
        console.error("Error detallado al crear usuario:", error);
        
        // Manejo específico de errores de Prisma
        if (error.code === 'P2002') {
            return res.status(400).json({ 
                success: false, 
                message: "Ya existe un usuario con ese email o login" 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: "Error interno del servidor: " + error.message 
        });
    }
};


