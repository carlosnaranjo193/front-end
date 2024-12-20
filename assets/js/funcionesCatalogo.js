import { api } from "./utils.js";
import { cargarDatosProductos, modal, showAlert } from "./script.js";

const form = document.querySelector("form");

// Función para cargar los datos en el formulario
const cargarDatosEnFormulario = (producto) => {
    const {editar, precio, nombre, descripcion, imagen} = form.elements;
    editar.value = producto.id;
    precio.value = producto.precio;
    nombre.value = producto.nombre;
    descripcion.value = producto.descripcion;    
    imagen.value = producto.imagen;     
};
// Función para realizar administracion de errores
const manejarError = (error) => {
    const mensaje = error?.response?.data?.message || "Error desconocido";
    showAlert("Error!", mensaje, "error");
};

window.editarProducto = (id) => {
    console.log(id)
    api
        .get("/producto/" + id)
        .then(({ data }) => {
            cargarDatosEnFormulario(data);
            modal.show(); // Abrir el modal
        })
        .catch(manejarError);
}

window.eliminarProducto = (id) => {
    Swal.fire({
        title: "Estas seguro?",
        text: "No podras revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, por favor borrar!",
        cancelButtonText: "Cancelar",
    }).then(function (result) {
        if (result.isConfirmed) {
            api
                .delete("/producto/" + id)
                .then(({ data }) => {
                    console.log(data);
                    showAlert("Eliminado!", data.message, "success");
                    cargarDatosProductos();
                })
                .catch(manejarError);
        }
    });
}

window.limpiarFormulario = () => {
    form.reset();
}