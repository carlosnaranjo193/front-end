import { api } from "./utils.js";
import './funcionesCatalogo.js'

// abrir el modal
export const modal = new bootstrap.Modal("#formulario-producto-nuevo", {
    keyboard: false,
});

// Función genérica para mostrar mensajes de alerta
export const showAlert = (title, message, type) => {
    Swal.fire(title, message, type);
};

// Si el botón flotante se acerca al footer, ajusta su posición
const controlBtnFlotante = (btnFlotante) => {
    const footer = document.querySelector("footer");
    const footerRect = footer.getBoundingClientRect();

    if (footerRect.top < window.innerHeight) {
        btnFlotante.style.bottom = `${20 + (window.innerHeight - footerRect.top)}px`;
    } else {
        btnFlotante.style.bottom = '20px';
    }
}

const refrecarComponentes = (form) => {
    cargarDatosProductos();
    form.reset();
    modal.hide()
}

document.addEventListener("DOMContentLoaded", () => {
    btnFlotanteNuevoProducto();
    cargarDatosProductos(); // llamado a la funcion cargarDatosProductos
    crearProducto();
});

function btnFlotanteNuevoProducto() {
    const btnNuevaProducto = document.getElementById("btn-nuevo-producto");
    const btnFlotante = document.getElementById("btn-flotante");

    // Función para manejar el scroll
    window.addEventListener("scroll", function () {

        if (window.scrollY > 100) { // Cambia 100 por el valor que desees
            btnNuevaProducto.style.display = "none"; // Ocultar el botón
            btnFlotante.style.display = "flex"; // Mostrar el botón flotante
        } else {
            btnNuevaProducto.style.display = "block"; // Mostrar el botón
            btnFlotante.style.display = "none"; // Ocultar el botón flotante
        }
        controlBtnFlotante(btnFlotante);
    });
}

function crearProducto() {
    const form = document.querySelector("form");
    const {precio, nombre, imagen, descripcion, editar } = form.elements;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const data = {
            precio: precio.value,
            nombre: nombre.value,
            descripcion: descripcion.value,
            imagen: imagen.value,         
            
        };

        const solicitud = {
            method: editar.value ? "PUT" : "POST",
            url: editar.value ? `/producto/${editar.value}` : "/producto",
            data,
        }

        api(solicitud)
            .then(({ data }) => {
                console.log(data);
                showAlert("Éxito!", data.message, "success");
                refrecarComponentes(form);
            })
            .catch((err) => Swal.fire("Error!", err?.response?.data?.message, "error"));
    })
}

export function cargarDatosProductos() {
    const wrapper = document.querySelector("#card-wrapper");
    wrapper.innerHTML = "";

    api.get("/productos").then(({ data }) => {

        for (const producto of data) {
            wrapper.innerHTML += `
      
                <div class="card">
                  <div>
                    <img src="${producto.imagenurl}" class="card-img-top" alt="${producto.nombredelproducto}" onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200?text=${producto.nombre}';" >
                   </div>
                    <div class="card-body">
                        <h5 class="card-title">${producto.nombredelproducto}</h5>
                        <p class="card-text">${producto.descripcion}</p>
                        <a href="#" class="btn btn-primary">Ver más</a>
                    </div><div class="col-md-12 p-4">
                      <div class="d-grid gap-2">
                        <button class="btn btn-primary"
                          onclick="editarProducto(${producto.ID})">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger" onclick="eliminarProducto(${producto.ID})">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
               
        </div>`;
        }
    });
}