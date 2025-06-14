import prisma from "../utils/prisma.js";

// Renderizar la vista de categorías
export const renderCategorias = async (req, res) => {
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

    const categorias = await prisma.categoria_articulo.findMany();

    res.render("categorias", {
        pageTitle: "Categorias - NeoPOS",
        user,
        categorias,
        activeMenu: { categorias: true }
    });
};

// Agregar categoría
export const agregarCategoria = async (req, res) => {
    const { nombre, descripcion, activa } = req.body;

    try {
        await prisma.categoria_articulo.create({
            data: {
                nombre,
                descripcion,
                activa: activa === "1" ? true : false
            }
        });
        res.redirect("/categorias");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al agregar la categoría");
    }
};

// Editar categoría
export const editarCategoria = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, activa } = req.body;
    try {
        await prisma.categoria_articulo.update({
            where: { id_categoria_articulo: parseInt(id) },
            data: {
                nombre,
                descripcion,
                activa: activa === "1" ? true : false
            }
        });
        res.redirect("/categorias");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al editar la categoría");
    }
};

export const activarCategoria = async (req, res) => {
  await prisma.categoria_articulo.update({
    where: { id_categoria_articulo: parseInt(req.params.id) },
    data: { activa: true }
  });
  res.redirect('/categorias');
};

export const desactivarCategoria = async (req, res) => {
  await prisma.categoria_articulo.update({
    where: { id_categoria_articulo: parseInt(req.params.id) },
    data: { activa: false }
  });
  res.redirect('/categorias');
};