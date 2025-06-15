async function toggleActivo(button, userTercero, currentState) {
    try {
        const response = await fetch(`/clientes/${userTercero}/toggle`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activo: !currentState })
        });

        if (response.ok) {
            const newState = !currentState;
            button.className = newState ? "btn btn-sm btn-neo-agregar" : "btn btn-sm btn-danger";
            const icono = button.querySelector("i");
            if (icono) {
                icono.className = newState ? "bi bi-check-circle-fill" : "bi bi-x-circle-fill";
            }
            button.setAttribute("onclick", `toggleActivo(this, ${userTercero}, ${newState})`);
        } else {
            console.error("Error al cambiar estado del usuario");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}
function filtrarClientes() {
    const input = document.getElementById("buscador").value.toLowerCase();
    const filas = document.querySelectorAll("#tabla-clientes tr");

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
document.getElementById("formRegiTercero").addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    
    console.log("Enviando datos:", data); // Para debugging

    try {
        const response = await fetch("/clientes/nuevo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        
        if (result.success) {
            alert(result.message);
            const modal = bootstrap.Modal.getInstance(document.getElementById("modalRegiTercero"));
            modal.hide();
            window.location.reload();
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Error de conexión. Intenta nuevamente.");
    }
});
function abrirModalEditar(id, nombre, tipoDoc, numeroDoc, direccion, telefono, email) {

    document.getElementById('edit_id_tercero').value = id;
    document.getElementById('edit_nombre_razon_social').value = nombre;
    document.getElementById('edit_tipo_documento_identidad').value = tipoDoc;
    document.getElementById('edit_numero_documento_identidad').value = numeroDoc;
    document.getElementById('edit_direccion').value = direccion;
    document.getElementById('edit_telefono_contacto').value = telefono;
    document.getElementById('edit_email').value = email;
    
    const modal = new bootstrap.Modal(document.getElementById('modalEditarTercero'));
    modal.show();
}
document.getElementById("formEditarTercero").addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    const clienteId = data.id_tercero;

    try {
        const response = await fetch(`/clientes/${clienteId}/editar`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        
        if (result.success) {
            alert(result.message);
            const modal = bootstrap.Modal.getInstance(document.getElementById("modalEditarTercero"));
            modal.hide();
            window.location.reload();
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Error de conexión. Intenta nuevamente.");
    }
});