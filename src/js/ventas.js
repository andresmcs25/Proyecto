function filtrarVentas() {
    const input = document.getElementById("buscador").value.toLowerCase();
    const filas = document.querySelectorAll("#tabla-ventas tr");

    filas.forEach(fila => {
        const textoFila = fila.textContent.toLowerCase();
        if (textoFila.includes(input)) {
            fila.style.display = "";
            fila.style.transition = "all 0.3s ease-in-out"; // Efecto suave
            fila.style.opacity = 1;
        } else {
            fila.style.display = "none";
            fila.style.opacity = 0;
        }
    });
}
let productosVenta = [];

function agregarProducto() {
    const selectArticulo = document.getElementById('selectArticulo');
    const cantidad = parseFloat(document.getElementById('cantidadArticulo').value);
    const porcentajeDescuento = parseFloat(document.getElementById('descuentoArticulo').value) || 0;
    
    if (!selectArticulo.value || !cantidad || cantidad <= 0) {
        alert('Selecciona un producto y especifica una cantidad válida');
        return;
    }
    
    const option = selectArticulo.options[selectArticulo.selectedIndex];
    const id_articulo = selectArticulo.value;
    const nombre = option.dataset.nombre;
    const precioBase = parseFloat(option.dataset.precio);
    const stock = parseFloat(option.dataset.stock);
    const aplicaImpuesto = option.dataset.impuesto === 'true';
    
    if (cantidad > stock) {
        alert(`Stock insuficiente. Disponible: ${stock}`);
        return;
    }
    
    const productoExistente = productosVenta.find(p => p.id_articulo === id_articulo);
    if (productoExistente) {
        alert('Este producto ya está agregado a la venta');
        return;
    }
    
    const montoDescuentoLinea = (precioBase * cantidad * porcentajeDescuento) / 100;
    const precioConDescuento = precioBase - (precioBase * porcentajeDescuento / 100);
    const subtotalNeto = cantidad * precioConDescuento;
    const tasaImpuesto = aplicaImpuesto ? 19 : 0;
    const montoImpuesto = (subtotalNeto * tasaImpuesto) / 100;
    const totalLinea = subtotalNeto + montoImpuesto;
    
    const producto = {
        id_articulo,
        nombre,
        cantidad,
        precio_venta_unitario_base: precioBase,
        porcentaje_descuento_linea: porcentajeDescuento,
        monto_descuento_linea: montoDescuentoLinea,
        precio_unitario_con_descuento: precioConDescuento,
        subtotal_linea_neto: subtotalNeto,
        tasa_impuesto_linea: tasaImpuesto,
        monto_impuesto_linea: montoImpuesto,
        total_linea: totalLinea
    };
    
    productosVenta.push(producto);
    actualizarTablaProductos();
    calcularTotales();
    
    selectArticulo.value = '';
    document.getElementById('cantidadArticulo').value = '';
    document.getElementById('descuentoArticulo').value = '0';
}

function eliminarProducto(index) {
    productosVenta.splice(index, 1);
    actualizarTablaProductos();
    calcularTotales();
}

function actualizarTablaProductos() {
    const tbody = document.getElementById('productosVenta');
    tbody.innerHTML = '';
    
    productosVenta.forEach((producto, index) => {
        const fila = `
            <tr>
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td>$${producto.precio_venta_unitario_base.toFixed(2)}</td>
                <td>${producto.porcentaje_descuento_linea}%</td>
                <td>$${producto.precio_unitario_con_descuento.toFixed(2)}</td>
                <td>$${producto.subtotal_linea_neto.toFixed(2)}</td>
                <td>$${producto.monto_impuesto_linea.toFixed(2)}</td>
                <td><strong>$${producto.total_linea.toFixed(2)}</strong></td>
                <td>
                    <button type="button" class="btn btn-sm btn-danger" onclick="eliminarProducto(${index})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });
}

function calcularTotales() {
    const subtotalProductos = productosVenta.reduce((sum, p) => sum + p.subtotal_linea_neto, 0);
    const impuestosProductos = productosVenta.reduce((sum, p) => sum + p.monto_impuesto_linea, 0);
    
    const descuentosAdicionales = parseFloat(document.getElementById('total_descuentos').value) || 0;
    const impuestosAdicionales = parseFloat(document.getElementById('total_impuestos_venta').value) || 0;
    
    const subtotalTotal = subtotalProductos;
    const impuestosTotal = impuestosProductos + impuestosAdicionales;
    const totalFinal = subtotalTotal - descuentosAdicionales + impuestosTotal;
    
    document.getElementById('subtotal_venta_neto').value = subtotalTotal.toFixed(2);
    document.getElementById('total_venta_final').value = totalFinal.toFixed(2);
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('total_descuentos').addEventListener('input', calcularTotales);
    document.getElementById('total_impuestos_venta').addEventListener('input', calcularTotales);
    document.getElementById('tasa_impuesto_general_aplicada').addEventListener('input', calcularTotales);
    document.getElementById('formRegiVentas').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (productosVenta.length === 0) {
            alert('Debes agregar al menos un producto a la venta');
            return;
        }
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        data.detalles = productosVenta;
        
        try {
            const response = await fetch('/ventas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalRegiVentas'));
                modal.hide();
                alert('Venta creada exitosamente');
                window.location.reload();
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al crear la venta');
        }
    });

    document.getElementById('modalRegiVentas').addEventListener('hidden.bs.modal', function() {
        document.getElementById('formRegiVentas').reset();
        productosVenta = [];
        actualizarTablaProductos();
        calcularTotales();
    });
});
let todosLosTerceros = <%- JSON.stringify(terceros) %>;
let terceroSeleccionado = null;

function buscarClientesLocal() {
    const termino = document.getElementById('cliente_buscar').value.trim().toLowerCase();
    const listaTerceros = document.getElementById('lista_clientes');
    
    if (termino.length < 2) {
        listaTerceros.style.display = 'none';
        return;
    }
    
    const tercerosFiltrados = todosLosTerceros.filter(cliente => 
        cliente.nombre_razon_social.toLowerCase().includes(termino) ||
        cliente.numero_documento_identidad.includes(termino) ||
        (cliente.email && cliente.email.toLowerCase().includes(termino))
    ).slice(0, 10);
    
    mostrarResultadosClientes(tercerosFiltrados);
}

document.getElementById('cliente_buscar').addEventListener('input', buscarClientesLocal);

