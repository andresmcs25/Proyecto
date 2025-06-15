import PDFDocument from 'pdfkit';
import fs from 'fs';
import moment from 'moment';
import prisma from "../utils/prisma.js";

export const renderVentas = async (req, res) => {
    const userId = req.session.userId;
    
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
                usuario: { select: { nombre_completo: true }},
                detalle_venta: {
                    include: {
                        articulo: { select: { nombre: true } }
                    }
                }
            },
        });

        const terceros = await prisma.tercero.findMany({
            where: { 
                tipo_tercero: "Cliente",
                activo: true
            },
            select: {
                id_tercero: true,
                nombre_razon_social: true,
                numero_documento_identidad: true,
                tipo_documento_identidad: true
            },
            orderBy: {
                nombre_razon_social: 'asc'
            }
        });

        const articulos = await prisma.articulo.findMany({
            where: {
                activo: true,
                stock_actual: { gt: 0 }
            },
            select: {
                id_articulo: true,
                nombre: true,
                precio_venta_neto: true,
                stock_actual: true,
                aplica_impuesto: true
            }
        });

        res.render("ventas", { 
            user, 
            pageTitle: "Ventas - NeoPOS", 
            activeMenu: { ventas : true },
            ventas,
            terceros,
            articulos
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
                usuario: { select: { nombre_completo: true } },
                detalle_venta: {
                    include: {
                        articulo: {
                            select: { 
                                descripcion: true,
                                precio_venta_neto: true,
                                codigo_barra: true
                            }
                        }
                    }
                }
            }
        });

        if (!venta) {
            return res.status(404).send("Venta no encontrada");
        }

        const doc = new PDFDocument({ 
            margin: 40,
            size: 'A4',
            bufferPages: true
        });
        
        const filename = `factura_${idVenta}.pdf`;
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Type", "application/pdf");
        doc.pipe(res);
        
        moment.locale("es");
        const fechaFormateada = moment(venta.fecha_venta).format("dddd, D [de] MMMM [de] YYYY, HH:mm");

        doc.image("public/img/logo_1.PNG", 50, 35, { width: 70, height: 70 });
        
        // Información de la empresa (lado derecho del logo)
        doc.fontSize(18).fillColor('#2c3e50').text("FACTURA DE VENTA", 130, 45, { align: 'left' });
        doc.fontSize(10).fillColor('#7f8c8d').text("NeoPOS - Sistema de Ventas", 130, 65);
        doc.text("Teléfono: (123) 456-7890", 130, 78);
        doc.text("Email: info@neopos.com", 130, 91);

        doc.fontSize(12).fillColor('#2c3e50');
        doc.text(`Tipo: ${venta.tipo_comprobante}`, 400, 75, { align: 'right' });
        doc.text(`Factura N°: ${venta.serie_comprobante}-${venta.numero_comprobante}`, 400, 45, { align: 'right' });
        doc.fontSize(10).fillColor('#7f8c8d');
        doc.text(`Fecha: ${fechaFormateada}`, 300, 60, { align: 'right' });
        

        doc.moveTo(40, 120).lineTo(555, 120).lineWidth(2).strokeColor('#1ABC9C').stroke();

        doc.y = 140;
        doc.fontSize(14).fillColor('#2c3e50').text("INFORMACIÓN DEL CLIENTE", 40, doc.y);
        doc.y += 20;
        doc.rect(40, doc.y, 515, 80).fillAndStroke('#ecf0f1', '#bdc3c7');
        
        const clienteY = doc.y + 10;
        doc.fontSize(11).fillColor('#2c3e50');
        
        // Columna izquierda
        doc.text(`Cliente:`, 50, clienteY);
        doc.fillColor('#34495e').text(`${venta.tercero.nombre_razon_social}`, 120, clienteY);
        
        doc.fillColor('#2c3e50').text(`Documento:`, 50, clienteY + 15);
        doc.fillColor('#34495e').text(`${venta.tercero.tipo_documento_identidad}: ${venta.tercero.numero_documento_identidad}`, 120, clienteY + 15);
        
        doc.fillColor('#2c3e50').text(`Dirección:`, 50, clienteY + 30);
        doc.fillColor('#34495e').text(`${venta.tercero.direccion}`, 120, clienteY + 30);
        
        // Columna derecha
        doc.fillColor('#2c3e50').text(`Teléfono:`, 320, clienteY);
        doc.fillColor('#34495e').text(`${venta.tercero.telefono_contacto}`, 380, clienteY);
        
        doc.fillColor('#2c3e50').text(`Email:`, 320, clienteY + 15);
        doc.fillColor('#34495e').text(`${venta.tercero.email || 'No registrado'}`, 380, clienteY + 15);
        
        doc.fillColor('#2c3e50').text(`Vendedor:`, 320, clienteY + 30);
        doc.fillColor('#34495e').text(`${venta.usuario.nombre_completo}`, 380, clienteY + 30);

        doc.y = clienteY + 90;

        doc.fontSize(14).fillColor('#2c3e50').text("DETALLE DE PRODUCTOS", 40, doc.y);
        doc.y += 25;

        const tableTop = doc.y;
        const tableLeft = 40;
        const tableWidth = 515;
        
        const colWidths = {
            cantidad: 60,
            codigo: 90,
            descripcion: 200,
            precio: 75,
            subtotal: 90
        };

        doc.rect(tableLeft, tableTop, tableWidth, 25).fillAndStroke('#1ABC9C', '#16A085');
        
        doc.fontSize(10).fillColor('#ffffff');
        let xPos = tableLeft + 5;
        
        doc.text('CANT.', xPos, tableTop + 8, { width: colWidths.cantidad, align: 'center' });
        xPos += colWidths.cantidad;
        
        doc.text('CÓDIGO', xPos, tableTop + 8, { width: colWidths.codigo, align: 'center' });
        xPos += colWidths.codigo;
        
        doc.text('DESCRIPCIÓN', xPos, tableTop + 8, { width: colWidths.descripcion, align: 'center' });
        xPos += colWidths.descripcion;
        
        doc.text('PRECIO UNIT.', xPos, tableTop + 8, { width: colWidths.precio, align: 'center' });
        xPos += colWidths.precio;
        
        doc.text('SUBTOTAL', xPos, tableTop + 8, { width: colWidths.subtotal, align: 'center' });

        let currentY = tableTop + 25;
        
        venta.detalle_venta.forEach((detalle, index) => {
            const subtotalProducto = detalle.cantidad * detalle.precio_venta_unitario_base;
            const rowHeight = 25;
            
            const fillColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
            doc.rect(tableLeft, currentY, tableWidth, rowHeight).fillAndStroke(fillColor, '#dee2e6');
            
            doc.fontSize(9).fillColor('#2c3e50');
            xPos = tableLeft + 5;
            
            doc.text(detalle.cantidad.toString(), xPos, currentY + 8, { 
                width: colWidths.cantidad, 
                align: 'center' 
            });
            xPos += colWidths.cantidad;
            
            doc.text(detalle.articulo.codigo_barra || 'N/A', xPos, currentY + 8, { 
                width: colWidths.codigo, 
                align: 'left' 
            });
            xPos += colWidths.codigo;
            
            const descripcion = detalle.articulo.descripcion || 'Sin descripción';
            doc.text(descripcion.length > 35 ? descripcion.substring(0, 35) + '...' : descripcion, 
                    xPos, currentY + 8, { 
                width: colWidths.descripcion, 
                align: 'left' 
            });
            xPos += colWidths.descripcion;
            
            doc.text(`$${detalle.precio_venta_unitario_base.toFixed(2)}`, xPos, currentY + 8, { 
                width: colWidths.precio - 10, 
                align: 'right' 
            });
            xPos += colWidths.precio;
            
            doc.text(`$${subtotalProducto.toFixed(2)}`, xPos, currentY + 8, { 
                width: colWidths.subtotal -10, 
                align: 'right' 
            });
            
            currentY += rowHeight;
        });

        doc.moveTo(tableLeft, currentY).lineTo(tableLeft + tableWidth, currentY)
           .lineWidth(1).strokeColor('#bdc3c7').stroke();

        doc.y = currentY + 20;

        const resumenY = doc.y;
        const resumenLeft = 350;
        const resumenWidth = 205;

        doc.rect(resumenLeft, resumenY, resumenWidth, 100).fillAndStroke('#ecf0f1', '#bdc3c7');
        
        doc.fontSize(12).fillColor('#2c3e50').text("Resumen de Venta", resumenLeft + 10, resumenY + 10);
        
        const detalles = [
            { campo: "Subtotal:", valor: `$${venta.subtotal_venta_neto.toFixed(2)}`, color: '#34495e' },
            { campo: "Descuentos:", valor: `$${venta.total_descuentos.toFixed(2)}`, color: '#34495e' },
            { campo: "Impuestos:", valor: `$${venta.total_impuestos_venta.toFixed(2)}`, color: '#34495e' },
            { campo: "TOTAL:", valor: `$${venta.total_venta_final.toFixed(2)}`, color: '#34495e' }
        ];

        let detalleY = resumenY + 30;
        detalles.forEach((detalle, index) => {
            doc.fontSize(index === 3 ? 12 : 10);
            doc.fillColor('#2c3e50').text(detalle.campo, resumenLeft + 15, detalleY);
            doc.fillColor(detalle.color).text(detalle.valor, resumenLeft + 100, detalleY, { align: 'right', width: 90 });
            detalleY += index === 3 ? 20 : 15;
        });

        doc.y = Math.max(resumenY + 120, doc.y + 20);
        
        if (venta.observaciones && venta.observaciones.trim() !== '') {
            doc.fontSize(12).fillColor('#2c3e50').text("OBSERVACIONES:", 40, doc.y);
            doc.y += 15;
            doc.rect(40, doc.y, 515, 40).fillAndStroke('#fff3cd', '#ffeaa7');
            doc.fontSize(10).fillColor('#856404').text(venta.observaciones, 50, doc.y + 10, { 
                width: 495, 
                align: 'left' 
            });
            doc.y += 50;
        }

        doc.y += 30;
                
        // Firmas en dos columnas
        doc.moveTo(40, doc.y).lineTo(555, doc.y).lineWidth(1).strokeColor('#16A085').stroke();
        doc.y += 30;

        const firmaY = doc.y;

        doc.rect(60, firmaY, 180, 60).stroke('#bdc3c7');
        doc.rect(315, firmaY, 180, 60).stroke('#bdc3c7');

        // Títulos de las firmas
        doc.fontSize(10).fillColor('#2c3e50');
        doc.text("Firma del Cliente:", 60, firmaY + 5, { width: 180, align: 'center' });
        doc.text("Firma del Vendedor:", 315, firmaY + 5, { width: 180, align: 'center' });

        // Líneas para firmar dentro de las cajas
        doc.moveTo(80, firmaY + 45).lineTo(220, firmaY + 45).lineWidth(1).strokeColor('#bdc3c7').stroke();
        doc.moveTo(335, firmaY + 45).lineTo(475, firmaY + 45).lineWidth(1).strokeColor('#bdc3c7').stroke();

        doc.y = firmaY + 80;
        
        // Texto final
        doc.y += 20;
        doc.fontSize(8).fillColor('#95a5a6').text(
            "Gracias por su compra. Esta factura es un documento válido para efectos tributarios.",
            40, doc.y, { align: 'center', width: 515 }
        );

        doc.end();
    } catch (error) {
        console.error("Error generando PDF:", error);
        res.status(500).send("Error interno del servidor");
    }
};


export const regiVentas = async (req, res) => {
    const userId = req.session.userId;
    const {
        id_tercero_cliente,
        tipo_comprobante,
        serie_comprobante,
        numero_comprobante,
        subtotal_venta_neto,
        total_descuentos,
        total_impuestos_venta,
        total_venta_final,
        tasa_impuesto_general_aplicada,
        observaciones,
        detalles
    } = req.body;

    try {
        const nuevaVenta = await prisma.$transaction(async (prisma) => {
            const venta = await prisma.venta.create({
                data: {
                    id_tercero_cliente: parseInt(id_tercero_cliente),
                    id_usuario_vendedor: userId,
                    tipo_comprobante,
                    serie_comprobante,
                    numero_comprobante,
                    fecha_hora_venta: new Date(),
                    subtotal_venta_neto: parseFloat(subtotal_venta_neto),
                    total_descuentos: parseFloat(total_descuentos) || 0,
                    total_impuestos_venta: parseFloat(total_impuestos_venta) || 0,
                    total_venta_final: parseFloat(total_venta_final),
                    tasa_impuesto_general_aplicada: parseFloat(tasa_impuesto_general_aplicada) || 0,
                    observaciones: observaciones || '',
                    estado_venta: 'Pagada'
                }
            });

            if (detalles && detalles.length > 0) {
                for (const detalle of detalles) {
                    const cantidad = parseFloat(detalle.cantidad);
                    const precioBase = parseFloat(detalle.precio_venta_unitario_base);
                    const porcentajeDescuento = parseFloat(detalle.porcentaje_descuento_linea) || 0;
                    const montoDescuento = (precioBase * cantidad * porcentajeDescuento) / 100;
                    const precioConDescuento = precioBase - (precioBase * porcentajeDescuento / 100);
                    const subtotalNeto = cantidad * precioConDescuento;
                    const tasaImpuesto = parseFloat(detalle.tasa_impuesto_linea) || 0;
                    const montoImpuesto = (subtotalNeto * tasaImpuesto) / 100;

                    await prisma.detalle_venta.create({
                        data: {
                            id_venta: venta.id_venta,
                            id_articulo: parseInt(detalle.id_articulo),
                            cantidad: cantidad,
                            precio_venta_unitario_base: precioBase,
                            porcentaje_descuento_linea: porcentajeDescuento,
                            monto_descuento_linea: montoDescuento,
                            precio_unitario_con_descuento: precioConDescuento,
                            subtotal_linea_neto: subtotalNeto,
                            tasa_impuesto_linea: tasaImpuesto,
                            monto_impuesto_linea: montoImpuesto
                        }
                    });

                    await prisma.articulo.update({
                        where: { id_articulo: parseInt(detalle.id_articulo) },
                        data: {
                            stock_actual: {
                                decrement: cantidad
                            }
                        }
                    });
                }
            }

            return venta;
        });

        res.json({ 
            success: true, 
            message: 'Venta creada exitosamente',
            venta: nuevaVenta
        });
    } catch (error) {
        console.error("Error al crear la venta:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al crear la venta: ' + error.message 
        });
    }
};



