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

    document.getElementById('editar_precio_venta').addEventListener('input', function(e) {
        const valor = parseFloat(e.target.value);
        document.getElementById('editar_precio_venta_formateado').textContent = 
            !isNaN(valor) ? valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) : '';
    });

    document.getElementById('formEditarProducto').action = `/productos/editar/${articulo.id_articulo}`;
    var modal = new bootstrap.Modal(document.getElementById('modalEditarProducto'));
    modal.show();
}

let estadoProductoId = null;
let estadoProductoAccion = null;

function cambiarEstadoProducto(id, activar) {
  estadoProductoId = id;
  estadoProductoAccion = activar;
  const texto = activar
    ? "¿Seguro que deseas <b>activar</b> este producto?"
    : "¿Seguro que deseas <b>desactivar</b> este producto?";
  document.getElementById('textoConfirmarEstadoProducto').innerHTML = texto;
  const modal = new bootstrap.Modal(document.getElementById('modalConfirmarEstadoProducto'));
  modal.show();
}

document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('btnConfirmarEstadoProducto');
  if (btn) {
    btn.onclick = function() {
      if (estadoProductoId !== null && estadoProductoAccion !== null) {
        const accion = estadoProductoAccion ? 'activar' : 'desactivar';
        const form = document.getElementById('formCambiarEstadoProducto');
        form.action = `/productos/${accion}/${estadoProductoId}`;
        form.submit();
      }
    };
  }
});
