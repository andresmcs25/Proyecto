function abrirModalEditarCategoria(id) {
    const categoria = window.categoriasData.find(c => c.id_categoria_articulo === id);
    if (!categoria) return;

    document.getElementById('editar_id_categoria').value = categoria.id_categoria_articulo;
    document.getElementById('editar_nombre_categoria').value = categoria.nombre;
    document.getElementById('editar_descripcion_categoria').value = categoria.descripcion || '';
    document.getElementById('editar_activa_categoria').value = categoria.activa ? "1" : "0";
    document.getElementById('formEditarCategoria').action = `/categorias/editar/${categoria.id_categoria_articulo}`;

    var modal = new bootstrap.Modal(document.getElementById('modalEditarCategoria'));
    modal.show();
}

let estadoCategoriaId = null;
let estadoCategoriaAccion = null;

function cambiarEstadoCategoria(id, activar, nombre) {
  estadoCategoriaId = id;
  estadoCategoriaAccion = activar;
  const texto = activar
    ? `¿Seguro que deseas <b>activar</b> la categoría <b>${nombre}</b>?`
    : `¿Seguro que deseas <b>desactivar</b> la categoría <b>${nombre}</b>?`;
  document.getElementById('textoConfirmarEstadoCategoria').innerHTML = texto;
  const modal = new bootstrap.Modal(document.getElementById('modalConfirmarEstadoCategoria'));
  modal.show();
}

document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('btnConfirmarEstadoCategoria');
  if (btn) {
    btn.onclick = function() {
      if (estadoCategoriaId !== null && estadoCategoriaAccion !== null) {
        const accion = estadoCategoriaAccion ? 'activar' : 'desactivar';
        const form = document.getElementById('formCambiarEstadoCategoria');
        form.action = `/categorias/${accion}/${estadoCategoriaId}`;
        form.submit();
      }
    };
  }
});