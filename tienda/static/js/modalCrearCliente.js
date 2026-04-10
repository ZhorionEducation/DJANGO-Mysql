// Modal Nativo para crear cliente

const btnOpenModal = document.querySelector('#btnAddCliente');
const modalOverlay = document.querySelector('#modalCliente');
const btnCloseModal = document.querySelector('#btnCloseModal');
const modalBody = document.querySelector('.modal-body');

// abrimos el modal con esta funcion
const openModal = () => {
    fetch('/tienda/clientes/nuevo/', {
        headers: {
            'X-Requested-With': 'XMLHttpRequest' // Indicamos que es una petición AJAX
        }
    })
        .then(response => response.text())
        .then(html => {
            modalBody.innerHTML = html;
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // al ser un modal debemos interceptar el envio del formulario para que funcione al ser cargado dinamicamente
            attachFormListener();
        })
        .catch(error => {
            console.error('Error al cargar el formulario:', error);
        });
}

// Función para interceptar el envío del formulario
const attachFormListener = () => {
    const form = document.querySelector('.modal-body form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Obtener el CSRF token, este token es necesario para las peticiones POST en Django, lo obtenemos del formulario
            const csrfToken = form.querySelector('[name="csrfmiddlewaretoken"]').value;
            
            // Obtener datos del formulario
            const formData = new FormData(form);
            
            // Enviar con AJAX
            fetch('/tienda/clientes/nuevo/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                },
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    // Si es exitoso, cerrar modal y recargar la lista
                    closeModal();
                    location.reload();
                } else {
                    // Si hay error de validación, recargar el formulario con errores
                    return response.text().then(html => {
                        modalBody.innerHTML = html;
                        attachFormListener();
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

// Función para cerrar el modal
const closeModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    modalBody.innerHTML = '';
}

// Event listeners
btnOpenModal.addEventListener('click', openModal);
btnCloseModal.addEventListener('click', closeModal);

// Cerrar modal al hacer click en el overlay
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// Cerrar modal presionando ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
    }
});