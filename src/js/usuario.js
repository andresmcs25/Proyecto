async function toggleActivo(button, userId, currentState) {
    try {
        const response = await fetch(`/usuarios/${userId}/toggle`, {
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
async function eliminarUsuario(userId, button) {
    const confirmar = confirm("¿Estás seguro de que quieres eliminar este usuario?");

    if (!confirmar) return; // Si el usuario cancela, no elimina

    try {
        const response = await fetch(`/usuarios/${userId}/delete`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // Eliminar la fila de la tabla sin recargar la página
            const row = button.closest("tr");
            row.remove();
        } else {
            console.error("Error al eliminar usuario");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}
