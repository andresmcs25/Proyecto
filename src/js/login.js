const form = document.getElementById("login-form");
const errorDiv = document.getElementById("error-message");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorDiv.innerText = "";

    const formData = {
        username: form.username.value,
        password: form.password.value,
    };

    try {
        const res = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            const data = await res.json();
            window.location.href = data.redirectTo;
        } else {
            const text = await res.text();
            errorDiv.innerText = text || "Usuario o contraseña incorrectos";
        }
    } catch (error) {
        console.error("Error en login:", error);
        errorDiv.innerText = "Error de conexión. Intenta nuevamente.";
    }
});
