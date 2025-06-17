function formatearNumeroColombiano(numero) {
  const partes = numero.toString().split('.');
  const enteroConPuntos = partes[0]
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const decimales = partes[1] ? ',' + partes[1] : '';
  return `$ ${enteroConPuntos}${decimales}`;
}
    

  let detallesCompra = [];

  function agregarDetalleCompra() {
    const idArticulo = document.getElementById('selectArticulo').value;
    const nombreArticulo = document.getElementById('selectArticulo').selectedOptions[0]?.text;
    const cantidad = parseInt(document.getElementById('inputCantidad').value);
    const precio = parseFloat(document.getElementById('inputPrecio').value);

    console.log(precio)

    if (!idArticulo || !cantidad || !precio) {
      alert('Completa todos los campos del artículo');
      return;
    }

    const existe = detallesCompra.find(det => det.id_articulo == idArticulo);
    if (existe) {
      alert('Este artículo ya fue agregado');
      return;
    }

    detallesCompra.push({
      id_articulo: idArticulo,
      nombre: nombreArticulo,
      cantidad,
      precio_compra_unitario_neto: precio 
    });
    renderDetalleCompra();
    
    document.getElementById('selectArticulo').value = '';
    document.getElementById('inputCantidad').value = '';
    document.getElementById('inputPrecio').value = '';
  }

  function eliminarDetalleCompra(idx) {
    detallesCompra.splice(idx, 1);
    renderDetalleCompra();
  }

  function renderDetalleCompra() {
    const tbody = document.querySelector('#tablaDetalleCompra tbody');
    tbody.innerHTML = '';
    detallesCompra.forEach((det, idx) => {
      const newprecioUnitario = formatearNumeroColombiano(det.precio_compra_unitario_neto);
      console.log(newprecioUnitario)
      tbody.innerHTML += `
        <tr>
          <td>${det.nombre}</td>
          <td>${det.cantidad}</td>
          <td>${newprecioUnitario}</td>
          <td>${newprecioUnitario}</td>
          <td><button type="button" class="btn btn-danger btn-sm" onclick="eliminarDetalleCompra(${idx})">Quitar</button></td>
        </tr>
      `;
    });
    document.getElementById('inputDetallesCompra').value = JSON.stringify(detallesCompra);
  }

  document.getElementById('modalAgregarProducto').addEventListener('hidden.bs.modal', function () {
    detallesCompra = [];
    renderDetalleCompra();
  });

  document.getElementById('formAgregarCompra').addEventListener('submit', function(e) {
    if (detallesCompra.length === 0) {
      e.preventDefault();
      alert('Agrega al menos un artículo a la compra');
    }
  });