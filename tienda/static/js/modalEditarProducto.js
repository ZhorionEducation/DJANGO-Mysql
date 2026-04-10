const btnOpenModalEditarProducto = document.querySelectorAll('#btnEditarProducto');
const modalOverlayEditarProducto = document.querySelector('#modalEditarProducto');
const btnCloseModalEditarProducto = document.querySelector('#btnCloseModalEditar');
const modalBodyEditarProducto = document.querySelector('#modal-body-editar-producto');

const openModalEditarProducto = (productoId) => {
    // cargar el formuladio de edicion de producto usando fetch

    fetch(`/tienda/productos/${productoId}/editar/`, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest' // Indicamos que es una petición AJAX
        }
    })
        .then(response => response.text())
        .then(html => {
            modalBodyEditarProducto.innerHTML = html;
            // Mostrar el modal DESPUÉS de cargar el contenido
            modalOverlayEditarProducto.classList.add('active');
            document.body.style.overflow = 'hidden';
            // a la intercepcion le pasamos el id del producto actual para poder editar
            attachFormListenerEditarProducto(productoId);
        })
        .catch(error => {
            console.error('Error al cargar el formulario:', error);
        });
}

const attachFormListenerEditarProducto = (productoId) => {
    const form = document.querySelector('#modal-body-editar-producto form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Obtener el CSRF token, este token es necesario para las peticiones POST en Django, lo obtenemos del formulario
            const csrfToken = form.querySelector('[name="csrfmiddlewaretoken"]').value;
            // Obtener datos del formulario
            const formData = new FormData(form);
            // Enviar con AJAX - construir la URL con el productoId
            fetch(`/tienda/productos/${productoId}/editar/`, {
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
                    closeModalEditarProducto();
                    location.reload();
                } else {
                    // Si hay error de validación, recargar el formulario con errores
                    return response.text().then(html => {
                        modalBodyEditarProducto.innerHTML = html;
                        attachFormListenerEditarProducto(productoId);
                    });
                }
            })
            .catch(error => {
                console.error('Error al guardar producto:', error);
                alert('Error al guardar el producto');
            });
        });
    }
}

const closeModalEditarProducto = () => {
    modalOverlayEditarProducto.classList.remove('active');
    document.body.style.overflow = 'auto';
    modalBodyEditarProducto.innerHTML = '';
}

btnOpenModalEditarProducto.forEach(btn => {
    btn.addEventListener('click', () => {
        const productoId = btn.getAttribute('data-producto-id');
        openModalEditarProducto(productoId);
    });
});

btnCloseModalEditarProducto.addEventListener('click', closeModalEditarProducto);

modalOverlayEditarProducto.addEventListener('click', (e) => {
    if (e.target === modalOverlayEditarProducto) {
        closeModalEditarProducto();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModalEditarProducto();
    }
});
