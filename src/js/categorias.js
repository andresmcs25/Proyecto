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

function abrirModalEliminarCategoria(id) {
    const categoria = window.categoriasData.find(c => c.id_categoria_articulo === id);
    if (!categoria) return;

    document.getElementById('eliminar_id_categoria').value = categoria.id_categoria_articulo;
    document.getElementById('eliminar_nombre_categoria').textContent = categoria.nombre;
    document.getElementById('formEliminarCategoria').action = `/categorias/eliminar/${categoria.id_categoria_articulo}`;

    var modal = new bootstrap.Modal(document.getElementById('modalEliminarCategoria'));
    modal.show();
}