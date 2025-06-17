import prisma from "../utils/prisma.js";

export const renderProveedores = async (req, res) => {
    const userId = req.session.userId;
    const userFound = await prisma.usuario.findUnique({ where: { id_usuario: userId } });
    const userRol = await prisma.rol_usuario.findUnique({ where: { id_rol_usuario: userFound.id_rol_usuario } });
    const user = {
        nombre: userFound.nombre_completo,
        rol: userRol.nombre_rol,
        id_rol_usuario: userFound.id_rol_usuario,
    };

    const proveedores = await prisma.tercero.findMany({
        where: { tipo_tercero: "Proveedor" },
        select: {
            id_tercero: true,
            nombre_razon_social: true,
            tipo_documento_identidad: true, 
            numero_documento_identidad: true,
            direccion: true,                
            telefono_contacto: true,
            email: true,
            activo: true
        }
    });

    res.render("proveedores", {
        pageTitle: "Proveedores - NeoPOS",
        user,
        proveedores,
        activeMenu: { proveedores: true }
    });
};

export const agregarProveedor = async (req, res) => {
    const {
        nombre_razon_social,
        tipo_documento_identidad, 
        numero_documento_identidad,
        direccion,                
        telefono_contacto,
        email
    } = req.body;
    try {
        await prisma.tercero.create({
            data: {
                nombre_razon_social,
                tipo_documento_identidad, 
                numero_documento_identidad,
                direccion,                
                telefono_contacto,
                email,
                tipo_tercero: "Proveedor"
            }
        });
        res.redirect("/proveedores");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al agregar proveedor");
    }
};

export const editarProveedor = async (req, res) => {
    const { id } = req.params;
    const {
        nombre_razon_social,
        tipo_documento_identidad, 
        numero_documento_identidad,
        direccion,
        telefono_contacto,
        email
    } = req.body;

    try {
        await prisma.tercero.update({
            where: { id_tercero: parseInt(id) },
            data: {
                nombre_razon_social,
                tipo_documento_identidad, 
                numero_documento_identidad,
                direccion,
                telefono_contacto,
                email
            }
        });
        res.redirect("/proveedores");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al editar proveedor");
    }
};

export const activarProveedor = async (req, res) => {
  await prisma.tercero.update({
    where: { id_tercero: parseInt(req.params.id) },
    data: { activo: true }
  });
  res.redirect('/proveedores');
};

export const desactivarProveedor = async (req, res) => {
  await prisma.tercero.update({
    where: { id_tercero: parseInt(req.params.id) },
    data: { activo: false }
  });
  res.redirect('/proveedores');
};
