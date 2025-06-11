import prisma from "../utils/prisma.js";
import bcrypt from "bcryptjs";

export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Por favor ingresa usuario y contraseña");
    }

    try {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
        
        let whereClause;
        if (isEmail) {
            whereClause = { email: username };
        } else {
            whereClause = { login_acceso: username };
        }

        // Buscar usuario en la base de datos
        const userFound = await prisma.usuario.findFirst({ where: whereClause });

        if (!userFound) {
            return res.status(401).send("Usuario o contraseña incorrectos");
        }

        if (!userFound.activo) {
            return res.status(403).send("¡Cuenta inactiva! Contacta al administrador.");
        }

        // **Comparar la contraseña ingresada con la cifrada en la base de datos**
        const esCorrecta = await bcrypt.compare(password, userFound.password_hash);
        if (!esCorrecta) {
            return res.status(401).send("Usuario o contraseña incorrectos");
        }

        // Actualizar el último acceso
        await prisma.usuario.update({
            where: { id_usuario: userFound.id_usuario },
            data: { ultimo_acceso: new Date() }
        });

        // Guardar sesión del usuario
        req.session.userId = userFound.id_usuario;

        // Responder con éxito y la ruta de redirección
        return res.status(200).json({ message: "Login exitoso", redirectTo: "/home" });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).send("Error del servidor");
    }
};

export const logoutUser = async (req, res) => {
    try {
        // Verificar si existe una sesión activa
        if (!req.session || !req.session.userId) {
            return res.status(400).json({ 
                success: false, 
                message: "No hay sesión activa para cerrar" 
            });
        }

        const userId = req.session.userId;

        req.session.destroy((err) => {
            if (err) {
                console.error("Error al cerrar sesión:", err);
                return res.status(500).json({ 
                    success: false, 
                    message: "Error al cerrar la sesión" 
                });
            }

            res.clearCookie('connect.sid');
            res.status(200).json({ 
                success: true,
                message: "Cerrando sesión...",
                redirectTo: "/login" 
            });
        });

    } catch (error) {
        console.error("Error en logout:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error interno del servidor" 
        });
    }
};