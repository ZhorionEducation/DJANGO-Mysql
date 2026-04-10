const btnOpenModalEditarPedido = document.querySelectorAll('#btn-editar-pedido');
const modalOverlayEditarPedido = document.querySelector('#modalEditarPedido');
const btnCloseModalEditarPedido = document.querySelector('#btnCloseModalEditarPedido');
const modalBodyEditarPedido = document.querySelector('#modal-body-editar-pedido');

const openModalEditarPedido = (pedidoId) => {
    // Cargar el formulario de edicion de pedido usando fetch

    fetch(`/tienda/pedidos/${pedidoId}/editar/`, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest' // Indicamos que es una petición AJAX
        }
    })
        .then(response => response.text())
        .then(html => {
            modalBodyEditarPedido.innerHTML = html;
            // Mostrar el modal DESPUÉS de cargar el contenido
            modalOverlayEditarPedido.classList.add('active');
            document.body.style.overflow = 'hidden';
            // a la intercepcion le pasamos el id del pedido actual para poder editar
            attachFormListenerEditarPedido(pedidoId);
        })
        .catch(error => {
            console.error('Error al cargar el formulario:', error);
        });
}

const attachFormListenerEditarPedido = (pedidoId) => {
    const form = document.querySelector('#modal-body-editar-pedido form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Obtener el CSRF token, este token es necesario para las peticiones POST en Django, lo obtenemos del formulario
            const csrfToken = form.querySelector('[name="csrfmiddlewaretoken"]').value;
            // Obtener datos del formulario
            const formData = new FormData(form);
            // Enviar con AJAX - construir la URL con el pedidoId
            fetch(`/tienda/pedidos/${pedidoId}/editar/`, {
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
                    closeModalEditarPedido();
                    location.reload();
                } else {
                    // Si hay error de validación, recargar el formulario con errores
                    return response.text().then(html => {
                        modalBodyEditarPedido.innerHTML = html;
                        attachFormListenerEditarPedido(pedidoId);
                    });
                }
            })
            .catch(error => {
                console.error('Error al guardar pedido:', error);
                alert('Error al guardar el pedido');
            });
        });
    }
}

const closeModalEditarPedido = () => {
    modalOverlayEditarPedido.classList.remove('active');
    document.body.style.overflow = 'auto';
    modalBodyEditarPedido.innerHTML = '';
}

btnOpenModalEditarPedido.forEach(btn => {
    btn.addEventListener('click', (event) => {
        event.preventDefault();
        const pedidoId = btn.getAttribute('data-pedido-id');
        openModalEditarPedido(pedidoId);
    });
});

btnCloseModalEditarPedido.addEventListener('click', closeModalEditarPedido);

modalOverlayEditarPedido.addEventListener('click', (event) => {
    if (event.target === modalOverlayEditarPedido) {
        closeModalEditarPedido();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModalEditarPedido();
    }
});