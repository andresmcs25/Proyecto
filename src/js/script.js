async function toggleActivo(button, userId, currentState) {
    try {
        const response = await fetch(`/usuarios/${userId}/toggle`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activo: !currentState })
        });

        if (response.ok) {
            // Cambiar color y texto del botón directamente
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
