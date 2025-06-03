document.getElementById("toggleSidebar").addEventListener("click", function (e) {
    e.preventDefault();
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("d-none");
});
