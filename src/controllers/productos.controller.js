import prisma from '../utils/prisma.js';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const renderProductos = async (req, res) => {
    try {
        const articulos = await prisma.articulo.findMany({
            where: {
                activo: true 
            },
            select: {
                id_articulo: true,
                nombre: true,
                codigo_barra: true,
                stock_actual: true,
                precio_venta_neto: true,
                activo: true,
                ruta_imagen: true,
                categoria_articulo: {
                    select: {
                        nombre: true
                    }
                },
                unidad_medida: {
                    select: {
                        nombre: true,
                        abreviatura: true
                    }
                }
            },
            orderBy: {
                id_articulo: 'asc'
            }
        });

        const userId = req.session.userId;
        let userData = null;

        if (userId) {
            const userFromDb = await prisma.usuario.findUnique({
                where: { id_usuario: parseInt(userId) },
                select: {
                    nombre_completo: true,
                    rol_usuario: { 
                        select: { 
                            nombre_rol: true 
                        } 
                    }
                }
            });

            if (userFromDb) {
                userData = {
                    nombre: userFromDb.nombre_completo,
                    rol: userFromDb.rol_usuario ? userFromDb.rol_usuario.nombre_rol : 'Rol no definido'
                };
            }
        }

        res.render("productos", { 
        pageTitle: "Productos - NeoPOS",
        articulos,
        user: userData,
        activeMenu: { inventario: true, productos: true }
    });

    } catch (error) {
        console.error("Error al renderizar la página de productos:", error);
        res.status(500).send("Error al cargar la página de productos.");
    }
};