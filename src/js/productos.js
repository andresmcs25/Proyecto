function abrirModalEditar(id) {
    const articulo = window.articulosData.find(a => a.id_articulo === id);
    if (!articulo) return;

    document.getElementById('editar_id_articulo').value = articulo.id_articulo;
    document.getElementById('editar_nombre').value = articulo.nombre;
    document.getElementById('editar_codigo_barra').value = articulo.codigo_barra || '';
    document.getElementById('editar_categoria').value = articulo.categoria_articulo.id_categoria_articulo;
    document.getElementById('editar_stock').value = Math.floor(articulo.stock_actual);
    document.getElementById('editar_precio_venta').value = parseFloat(articulo.precio_venta_neto);
    document.getElementById('editar_precio_venta_formateado').textContent = 
        parseFloat(articulo.precio_venta_neto).toLocaleString('es-CO', { style: 'currency', currency: 'COP' });

    // Actualiza el formato en tiempo real si el usuario cambia el valor
    document.getElementById('editar_precio_venta').addEventListener('input', function(e) {
        const valor = parseFloat(e.target.value);
        document.getElementById('editar_precio_venta_formateado').textContent = 
            !isNaN(valor) ? valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) : '';
    });

    document.getElementById('formEditarProducto').action = `/productos/editar/${articulo.id_articulo}`;
    var modal = new bootstrap.Modal(document.getElementById('modalEditarProducto'));
    modal.show();
}
function confirmarEliminacionProducto(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto? ID: ' + id + '? Esta acción no se puede deshacer.')) {
        const form = document.getElementById('formEliminarProducto');
        form.action = `/productos/eliminar/${id}`;
        form.submit();
    }
}

