import prisma from "../utils/prisma.js";

export const renderIngresos = async (req, res) => {
  const userId = req.session.userId;

  const userFound = await prisma.usuario.findUnique({
    where: { id_usuario: userId },
  });
  const userRol = await prisma.rol_usuario.findUnique({
    where: { id_rol_usuario: userFound.id_rol_usuario },
  });
  const user = {
    nombre: userFound.nombre_completo,
    rol: userRol.nombre_rol,
    id_rol_usuario: userFound.id_rol_usuario,
  };

  const proveedores = await prisma.tercero.findMany({
    where: {
      tipo_tercero: "Proveedor",
    },
    select: {
      id_tercero: true,
      nombre_razon_social: true,
    },
  });

  const compras = await prisma.compra.findMany({
    include: {
      usuario: { select: { nombre_completo: true } },
      tercero: { select: { nombre_razon_social: true } },
    },
    orderBy: { fecha_hora_compra: "desc" },
  });

  // Formatea el total de cada compra antes de enviarlo a la vista
  const comprasFormateadas = compras.map((compra) => ({
    ...compra,
    total_compra_final: formatearNumeroColombiano(compra.total_compra_final),
  }));

  const articulos = await prisma.articulo.findMany({
    where: { activo: true },
    select: { id_articulo: true, nombre: true },
  });

  res.render("ingresos", {
    pageTitle: "Ingresos - NeoPOS",
    user,
    compras: comprasFormateadas, // <-- usa el array formateado
    proveedores,
    activeMenu: { ingresos: true },
    articulos,
  });
};

export const crearCompra = async (req, res) => {
  const {
    id_tercero,
    fecha_hora_compra,
    total_compra_final,
    observacion,
    estado_compra,
    tipo_comprobante,
    numero_comprobante,
    detalles,
  } = req.body;
  const userId = req.session.userId;

  try {
    // 1. Crear la compra
    const compra = await prisma.compra.create({
      data: {
        id_tercero_proveedor: parseInt(id_tercero),
        id_usuario_registro: userId,
        fecha_hora_compra: new Date(fecha_hora_compra),
        total_compra_final: parseFloat(total_compra_final),
        observaciones: observacion,
        estado_compra,
        tipo_comprobante,
        numero_comprobante,
      },
    });

    // 2. Crear los detalles y actualizar stock
    const detallesArr = JSON.parse(detalles);
    for (const det of detallesArr) {
      const cantidad = parseInt(det.cantidad);
      const precioUnitario = parseFloat(det.precio_compra_unitario_neto); // Cambia el nombre en el front si es necesario
      await prisma.detalle_compra.create({
        data: {
          id_compra: compra.id_compra,
          id_articulo: parseInt(det.id_articulo),
          cantidad: cantidad,
          precio_compra_unitario_neto: precioUnitario,
          subtotal_linea_neto: cantidad * precioUnitario,
        },
      });
      
      // Actualizar stock del artículo
      await prisma.articulo.update({
        where: { id_articulo: parseInt(det.id_articulo) },
        data: {
          stock_actual: { increment: cantidad },
        },
      });
    }

    res.redirect("/ingresos");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al registrar la compra");
  }
};

export const renderDetalleCompra = async (req, res) => {
  const { id } = req.params;
  const compra = await prisma.compra.findUnique({
    where: { id_compra: parseInt(id) },
    include: {
      tercero: true,
      usuario: true,
      detalle_compra: {
        include: { articulo: true },
      },
    },
  });
  res.render("detalle_compra", {
    pageTitle: "Detalle de Compra",
    compra,
  });
};

function formatearNumeroColombiano(numero) {
  const partes = numero.toString().split("."); 
  const enteroConPuntos = partes[0].replace(
    /\B(?=(\d{3})+(?!\d))/g,
    "."
  ); 
  return `$ ${enteroConPuntos}`;
}
