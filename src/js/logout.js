// js/logout.js o public/js/logout.js
async function logout() {
    try {
        const response = await fetch("/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            showSuccessMessage(result.message);
            setTimeout(() => {
                window.location.href = result.redirectTo;
            }, 1500);
        } else {
            showErrorMessage("Error al cerrar sesión: " + result.message);
        }
    } catch (error) {
        console.error("Error en logout:", error);
        showErrorMessage("Error de conexión al cerrar sesión");
    }
}

function showSuccessMessage(message) {
    const toast = `
        <div class="toast align-items-center text-white bg-success border-0 position-fixed top-0 end-0 m-3" role="alert" style="z-index: 9999;">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="bi bi-check-circle-fill me-2"></i>${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', toast);
    const toastElement = document.querySelector('.toast:last-child');
    const bsToast = new bootstrap.Toast(toastElement);
    bsToast.show();
}

function showErrorMessage(message) {
    const toast = `
        <div class="toast align-items-center text-white bg-danger border-0 position-fixed top-0 end-0 m-3" role="alert" style="z-index: 9999;">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', toast);
    const toastElement = document.querySelector('.toast:last-child');
    const bsToast = new bootstrap.Toast(toastElement);
    bsToast.show();
}

document.addEventListener("DOMContentLoaded", function() {
    const logoutButton = document.getElementById("logoutButton");
    const confirmLogoutBtn = document.getElementById("confirmLogout");
    
    console.log("Logout button:", logoutButton); // Para debugging
    console.log("Confirm button:", confirmLogoutBtn); // Para debugging
    
    if (logoutButton) {
        logoutButton.addEventListener("click", function(e) {
            e.preventDefault();
            const modal = new bootstrap.Modal(document.getElementById('logoutModal'));
            modal.show();
        });
    }
    
    if (confirmLogoutBtn) {
        confirmLogoutBtn.addEventListener("click", function() {
            const modal = bootstrap.Modal.getInstance(document.getElementById('logoutModal'));
            modal.hide();
            logout();
        });
    }
});
