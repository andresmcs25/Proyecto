async function toggleActivo(button, userId, currentState) {
    try {
        const response = await fetch(`/ventas/${userId}/toggle`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activo: !currentState })
        });

        if (response.ok) {
            // Cambiar color y texto del botón sin recargar la página
            const newState = !currentState;
            button.className = newState ? "btn btn-sm btn-success" : "btn btn-sm btn-danger";
            button.textContent = newState ? "Activo" : "Inactivo";
            button.setAttribute("onclick", `toggleActivo(this, ${userId}, ${newState})`);
        } else {
            console.error("Error al cambiar estado del usuario");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}
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