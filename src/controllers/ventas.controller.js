import PDFDocument from 'pdfkit';
import fs from 'fs';
import moment from 'moment';
import prisma from "../utils/prisma.js";

export const renderVentas = async (req, res) => {

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
            id_rol_usuario: userFound.id_rol_usuario
        };
        
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

export const generarFacturaPDF = async (req, res) => {
    const { idVenta } = req.params;

    try {
        // Obtener datos de la venta específica
        const venta = await prisma.venta.findUnique({
            where: { id_venta: Number(idVenta) },
            include: {
                tercero: { 
                    select: { 
                        nombre_razon_social: true, 
                        tipo_documento_identidad: true, 
                        numero_documento_identidad: true, 
                        direccion: true, 
                        telefono_contacto: true, 
                        email: true 
                    } 
                },
                usuario: { select: { nombre_completo: true } }
            }
        });

        if (!venta) {
            return res.status(404).send("Venta no encontrada");
        }


        // Crear el documento PDF
        const doc = new PDFDocument({ margin: 50 });
        const filename = `factura_${idVenta}.pdf`;
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Type", "application/pdf");
        doc.pipe(res);
        
        moment.locale("es");
        const fechaFormateada = moment(venta.fecha_hora_venta).format("dddd, D [de] MMMM YYYY, HH:mm");

        // 🔹 Encabezado con logo
        doc.image("public/img/logo_1.PNG", 50, 50, { width: 100 }); // Agrega un logo si tienes
        doc.fontSize(20).text("Factura de Venta", 200, 50, { align: "center" });
        doc.moveDown();
        doc.fontSize(12).text(`Fecha y Hora: ${fechaFormateada}`, { align: "right" });

        doc.moveDown();
        doc.moveDown();

        // 🔹 Datos generales del cliente y vendedor
        doc.fontSize(14).text(`Cliente: ${venta.tercero.nombre_razon_social}`);
        doc.text(`Dirección: ${venta.tercero.direccion}`);
        doc.text(`Teléfono: ${venta.tercero.telefono}`);
        doc.text(`Vendedor: ${venta.usuario.nombre_completo}`);
        doc.text(`Tipo Comprobante: ${venta.tipo_comprobante}`);
        doc.text(`Número Comprobante: ${venta.numero_comprobante}`);

        doc.moveDown();

        // 🔹 Línea separadora
        doc.lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        // 🔹 Tabla de detalle de la venta
        doc.fontSize(12).text("Resumen de Venta:", { underline: true });
        doc.moveDown();
        
        const detalles = [
            { campo: "Subtotal", valor: `$${venta.subtotal_venta_neto.toFixed(2)}` },
            { campo: "Descuentos", valor: `$${venta.total_descuentos.toFixed(2)}` },
            { campo: "Impuestos", valor: `$${venta.total_impuestos_venta.toFixed(2)}` },
            { campo: "Total", valor: `$${venta.total_venta_final.toFixed(2)}` },
        ];

        detalles.forEach((detalle) => {
            doc.text(`${detalle.campo}: ${detalle.valor}`, { align: "left" });
        });

        doc.moveDown();

        // 🔹 Observaciones
        doc.fontSize(12).text(`Observaciones: ${venta.observaciones}`, { align: "left" });

        // 🔹 Firma
        doc.moveDown();
        doc.text("Firma del Cliente: ____________________", { align: "right" });
        doc.text("Firma del Vendedor: ____________________", { align: "right" });

        doc.end();
    } catch (error) {
        console.error("Error generando PDF:", error);
        res.status(500).send("Error interno del servidor");
    }
};


