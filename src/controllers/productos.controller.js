import prisma from '../utils/prisma.js';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


function formatearNumeroColombiano(numero) {
  const partes = numero.toString().split('.'); // Separa enteros y decimales
  const enteroConPuntos = partes[0]
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Inserta puntos
  const decimales = partes[1] ? ',' + partes[1] : '';
  return enteroConPuntos + decimales;
}

async function getUserData(req) {
  const userId = req.session.userId;
  let userData = null;

  if (userId) {
    const userFromDb = await prisma.usuario.findUnique({
      where: { id_usuario: parseInt(userId) },
      select: {
        nombre_completo: true,
        id_rol_usuario: true,
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
        rol: userFromDb.rol_usuario ? userFromDb.rol_usuario.nombre_rol : 'Rol no definido',
        id_rol_usuario: userFromDb.id_rol_usuario
      };
    }
  }
  return userData;
}

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
        categoria_articulo: {
          select: {
            nombre: true
          }
        },
      },
      orderBy: {
        id_articulo: 'asc'
      }
    });

    const userData = await getUserData(req);

    const categorias = await prisma.categoria_articulo.findMany();

    

    const newArticules = articulos.map(articulo => {

      const newPrice = formatearNumeroColombiano(articulo.precio_venta_neto)
      return {
          id_articulo: articulo.id_articulo,
          nombre: articulo.nombre,
          codigo_barra: articulo.codigo_barra,
          stock_actual: articulo.stock_actual,
          precio_venta_neto: newPrice,
          activo: articulo.activo,
          categoria_articulo: articulo.categoria_articulo
      }      
    })
    

    res.render("productos", { 
      pageTitle: "Productos - NeoPOS",
      articulos: newArticules,
      user: userData,
      activeMenu: { inventario: true, productos: true },
      categorias,
      errores: []
    });

  } catch (error) {
    console.error("Error al renderizar la página de productos:", error);
    res.status(500).send("Error al cargar la página de productos.");
  }
};

export const crearProducto = async (req, res) => {
  const {
    nombre,
    codigo_barra,
    stock_actual,
    precio_venta_neto,
    categoria
  } = req.body;

  // Validaciones básicas
  let errores = [];

  if (!nombre || nombre.trim().length === 0) {
    errores.push('El campo nombre es obligatorio.');
  }
  if (!stock_actual || isNaN(Number(stock_actual)) || Number(stock_actual) < 0) {
    errores.push('El stock debe ser un número válido mayor o igual a 0.');
  }
  if (!precio_venta_neto || isNaN(Number(precio_venta_neto)) || Number(precio_venta_neto) < 0) {
    errores.push('El precio de venta debe ser un número válido mayor o igual a 0.');
  }
  if (!categoria || isNaN(Number(categoria))) {
    errores.push('Debe seleccionar una categoría válida.');
  }

  if (errores.length > 0) {
    const userData = await getUserData(req);

    const categorias = await prisma.categoria_articulo.findMany();
    const articulos = await prisma.articulo.findMany({
      where: { activo: true },
      select: {
        id_articulo: true,
        nombre: true,
        codigo_barra: true,
        stock_actual: true,
        precio_venta_neto: true,
        activo: true,
        categoria_articulo: {
          select: {
            nombre: true
          }
        },
      },
      orderBy: {
        id_articulo: 'asc'
      }
    });

    return res.render('productos', {
      pageTitle: 'Productos - NeoPOS',
      articulos,
      user: userData,
      activeMenu: { inventario: true, productos: true },
      categorias,
      errores
    });
  }
let nombreFormateado = nombre.split(' ').map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1)).join(' '); 

  try {
    await prisma.articulo.create({
      data: {
        nombre:nombreFormateado,
        codigo_barra,
        stock_actual: Number(stock_actual),
        precio_venta_neto: Number(precio_venta_neto),
        id_categoria_articulo: Number(categoria),
        activo: true
      }
    });
    res.redirect('/productos');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear el producto');
  }
};

export const editarProducto = async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    codigo_barra,
    stock_actual,
    precio_venta_neto,
    categoria
  } = req.body;

  let errores = [];

  if (!nombre || nombre.trim().length === 0) {
    errores.push('El campo nombre es obligatorio.');
  }
  if (!stock_actual || isNaN(Number(stock_actual)) || Number(stock_actual) < 0) {
    errores.push('El stock debe ser un número válido mayor o igual a 0.');
  }
  if (!precio_venta_neto || isNaN(Number(precio_venta_neto)) || Number(precio_venta_neto) < 0) {
    errores.push('El precio de venta debe ser un número válido mayor o igual a 0.');
  }
  if (!categoria || isNaN(Number(categoria))) {
    errores.push('Debe seleccionar una categoría válida.');
  }

  if (errores.length > 0) {
    // Si hay errores, recarga la página con los mensajes
    const userData = await getUserData(req);
    const categorias = await prisma.categoria_articulo.findMany();
    const articulos = await prisma.articulo.findMany({
      where: { activo: true },
      select: {
        id_articulo: true,
        nombre: true,
        codigo_barra: true,
        stock_actual: true,
        precio_venta_neto: true,
        activo: true,
        categoria_articulo: {
          select: { nombre: true }
        },
      },
      orderBy: { id_articulo: 'asc' }
    });

    return res.render('productos', {
      pageTitle: 'Productos - NeoPOS',
      articulos,
      user: userData,
      activeMenu: { inventario: true, productos: true },
      categorias,
      errores
    });
  }

  let nombreFormateado = nombre.split(' ').map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1)).join(' ');

  try {
    await prisma.articulo.update({
      where: { id_articulo: Number(id) },
      data: {
        nombre: nombreFormateado,
        codigo_barra,
        stock_actual: Number(stock_actual),
        precio_venta_neto: Number(precio_venta_neto),
        id_categoria_articulo: Number(categoria)
      }
    });
    res.redirect('/productos');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al editar el producto');
  }
};
export const eliminarProducto = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.articulo.delete({
      where: { id_articulo: Number(id) }
    });
    res.redirect('/productos');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar el producto');
  }
};