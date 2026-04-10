const btnOpenModalEditar = document.querySelectorAll('#editarCliente');
const modalOverlayEditar = document.querySelector('#modalEditarCliente');
const btnCloseModalEditar = document.querySelector('#btnCloseModalEditar');
const modalBodyEditar = document.querySelector('#modal-body-editar');

const openModalEditar = (id) => {
    // Cargar el formulario de edición del cliente usando fetch
    
    fetch(`/tienda/clientes/${id}/editar/`, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest' // Indicamos que es una petición AJAX
        }
    })
        .then(response => response.text())
        .then(html => {
            modalBodyEditar.innerHTML = html;
            // Mostrar el modal DESPUÉS de cargar el contenido
            modalOverlayEditar.classList.add('active');
            document.body.style.overflow = 'hidden';

            // a la intercepcion le pasamos el id del cliente actual para poder editar
            attachFormListenerEditar(id);
        })
        .catch(error => {
            console.error('Error al cargar el formulario:', error);
        });
}

const attachFormListenerEditar = (clienteId) => {
    const form = document.querySelector('#modal-body-editar form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Obtener el CSRF token, este token es necesario para las peticiones POST en Django, lo obtenemos del formulario
            const csrfToken = form.querySelector('[name="csrfmiddlewaretoken"]').value;
            // Obtener datos del formulario
            const formData = new FormData(form);
            // Enviar con AJAX - construir la URL con el clienteId
            fetch(`/tienda/clientes/${clienteId}/editar/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    // Si es exitoso, cerrar modal y recargar la lista
                    closeModalEditar();
                    location.reload();
                } else {
                    // Si hay error de validación, recargar el formulario con errores
                    return response.text().then(html => {
                        modalBodyEditar.innerHTML = html;
                        attachFormListenerEditar(clienteId);
                    });
                }
            })
            .catch(error => {
                console.error('Error al guardar cliente:', error);
                alert('Error al guardar el cliente');
            });
        });
    }
}

const closeModalEditar = () => {
    modalOverlayEditar.classList.remove('active');
    document.body.style.overflow = 'auto';
    modalBodyEditar.innerHTML = '';
}

btnOpenModalEditar.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        const clienteId = button.getAttribute('data-cliente-id');
        openModalEditar(clienteId);
        
    });
});

btnCloseModalEditar.addEventListener('click', closeModalEditar);

modalOverlayEditar.addEventListener('click', (event) => {
    if (event.target === modalOverlayEditar) {
        closeModalEditar();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModalEditar();
    }
});