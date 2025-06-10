document.getElementById("toggleSidebar").addEventListener("click", function (e) {
    e.preventDefault();
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
        sidebar.classList.toggle("d-none");
    }
});
