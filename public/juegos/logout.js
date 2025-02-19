document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.style.display = "block"; // Mostrar el botón si está oculto

        logoutButton.addEventListener("click", () => {
            // 🗑️ Borrar datos del Local Storage
            localStorage.clear();

            // 🔄 Redirigir a index.html
            window.location.href = "/index.html";
        });
    } else {
        console.error("Error: No se encontró el botón de logout.");
    }
});
