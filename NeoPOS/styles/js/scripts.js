        document.getElementById("toggleSidebar").addEventListener("click", function (e) {
            e.preventDefault();
            const sidebar = document.getElementById("sidebar");
            sidebar.classList.toggle("d-none");
        });
        document.addEventListener('DOMContentLoaded', function () {
        async function cargarProductos() {
        try {
            const response = await fetch('../php/getProductos.php');
            const productos = await response.json();

            const tbody = document.querySelector('#tabla-productos tbody');
            if (!tbody) return; // Evita errores si la tabla no está en la página

            tbody.innerHTML = ''; // limpiar tabla

            productos.forEach(prod => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${prod.idarticulo}</td>
                    <td>${prod.idcategoria}</td>
                    <td>${prod.codigo}</td>
                    <td>${prod.nombre}</td>
                    <td>${prod.stock}</td>
                    <td>${prod.descripcion}</td>
                    <td>${prod.imagen}</td>
                    <td>${prod.condicion}</td>
                    <td>
                    <span class="badge ${prod.stock > 0 ? 'bg-success' : 'bg-danger'}">
                    ${prod.stock > 0 ? 'Disponible' : 'Agotado'}
                    </span>
                    </td>
                `;
                tbody.appendChild(fila);
            });
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    }

    cargarProductos();
});
    const formulario = new bootstrap.Collapse(document.getElementById('formulario-producto'), {toggle: false});
    function mostrarFormulario(mostrar) {
      if(mostrar) formulario.show();
      else formulario.hide();
    };

document.getElementById("formAgregarProducto").addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("categoria", document.getElementById("categoria").value);
    formData.append("codigo", document.getElementById("codigo").value);
    formData.append("nombre", document.getElementById("nombre").value);
    formData.append("stock", document.getElementById("stock").value);
    formData.append("descripcion", document.getElementById("descripcion").value);
    formData.append("imagen", document.getElementById("imagen").files[0]);

    fetch("../php/agregarProducto.php", {
        method: "POST",
        body: formData,
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.success) {
            alert("Producto agregado correctamente");
            mostrarFormulario(false);
            document.getElementById("formAgregarProducto").reset();
            cargarProductos(); // tu función que refresca la tabla
        } else {
            alert("Error: " + data.error);
        }
    })
    .catch((err) => console.error("Error:", err));
});
function cargarProductos() {
    fetch("../php/getProductos.php")
        .then((res) => res.json())
        .then((productos) => {
            const tbody = document.querySelector("#tabla-productos tbody");
            tbody.innerHTML = ""; // Limpiar tabla

            productos.forEach((producto) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${producto.idarticulo}</td>
                    <td>${producto.categoria}</td>
                    <td>${producto.codigo}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.stock}</td>
                    <td>${producto.descripcion}</td>
                    <td><img src="${producto.imagen}" alt="${producto.nombre}" width="50"></td>
                    <td>${producto.condicion}</td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch((err) => console.error("Error al cargar productos:", err));
}
