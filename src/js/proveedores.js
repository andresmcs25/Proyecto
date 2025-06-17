function abrirModalEditarProveedor(id) {
  const prov = window.proveedoresData.find((p) => p.id_tercero === id);
  if (!prov) return;
  document.getElementById("editar_id_tercero").value = prov.id_tercero;
  document.getElementById("editar_nombre_razon_social").value =
    prov.nombre_razon_social;
  document.getElementById("editar_tipo_documento_identidad").value =
    prov.tipo_documento_identidad || "";
  document.getElementById("editar_numero_documento_identidad").value =
    prov.numero_documento_identidad;
  document.getElementById("editar_direccion").value = prov.direccion || "";
  document.getElementById("editar_telefono_contacto").value =
    prov.telefono_contacto || "";
  document.getElementById("editar_email").value = prov.email || "";
  document.getElementById(
    "formEditarProveedor"
  ).action = `/proveedores/editar/${prov.id_tercero}`;
  var modal = new bootstrap.Modal(
    document.getElementById("modalEditarProveedor")
  );
  modal.show();
}

let estadoProveedorId = null;
let estadoProveedorAccion = null;

function cambiarEstadoProveedor(id, activar, nombre) {
  estadoProveedorId = id;
  estadoProveedorAccion = activar;
  const texto = activar
    ? `¿Seguro que deseas <b>activar</b> el proveedor <b>${nombre}</b>?`
    : `¿Seguro que deseas <b>desactivar</b> el proveedor <b>${nombre}</b>?`;
  document.getElementById("textoConfirmarEstadoProveedor").innerHTML = texto;
  const modal = new bootstrap.Modal(
    document.getElementById("modalConfirmarEstadoProveedor")
  );
  modal.show();
}

function cambiarEstadoProveedorDesdeBoton(btn) {
  const id = parseInt(btn.getAttribute("data-id"));
  const activar = btn.getAttribute("data-accion") === "true";
  const nombre = btn.getAttribute("data-nombre");
  cambiarEstadoProveedor(id, activar, nombre);
}

document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("btnConfirmarEstadoProveedor");
  if (btn) {
    btn.onclick = function () {
      if (estadoProveedorId !== null && estadoProveedorAccion !== null) {
        const accion = estadoProveedorAccion ? "activar" : "desactivar";
        const form = document.getElementById("formCambiarEstadoProveedor");
        form.action = `/proveedores/${accion}/${estadoProveedorId}`;
        form.submit();
      }
    };
  }
});
