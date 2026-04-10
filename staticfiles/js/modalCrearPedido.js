const btnOpenModalPedido = document.querySelector('#btnAddPedido');
const btnCloseModalPedido = document.querySelector('#btnCloseModalCrearPedido');
const modalOverlayPedido = document.querySelector('#modalCrearPedido');
const modalBodyPedido = document.querySelector('#modalBodyPedido');

const openModalPedido = () => {
    // Cargar el formulario de creación del pedido usando fetch
    fetch('/tienda/pedidos/nuevo/', {
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
        .then(response => response.text())
        .then(html => {
            modalBodyPedido.innerHTML = html;
            // Mostrar el modal DESPUÉS de cargar el contenido
            modalOverlayPedido.classList.add('active');
            document.body.style.overflow = 'hidden';
            // al ser un modal debemos interceptar el envio del formulario para que funcione al ser cargado dinamicamente
            attachFormListenerPedido();
            // este calcularPrecio es de otro archivo js, pero lo llamamos aqui porque es un modal dinamico, entonces el codigo de calcular precio se ejecuta cada vez que se abre el modal, asi aseguramos que los event listener de los selects y inputs de cantidad se asignen correctamente cada vez que se carga el formulario en el modal
            calcularPrecio();
            attachAgregarProductoListener();
        })
        .catch(error => {
            console.error('Error al cargar el formulario:', error);
        });
}

// Función para interceptar el envío del formulario
const attachFormListenerPedido = () => {
    const form = document.querySelector('#modalBodyPedido form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Obtener el CSRF token, este token es necesario para las peticiones POST en Django, lo obtenemos del formulario
            const csrfToken = form.querySelector('[name="csrfmiddlewaretoken"]').value;
            // Obtener datos del formulario
            const formData = new FormData(form);
            
            // Enviar con AJAX
            fetch('/tienda/pedidos/nuevo/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                },
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    // Si es exitoso, cerrar modal y recargar la lista
                    closeModalPedido();
                    location.reload();
                } else {
                    // Si hay error de validación, recargar el formulario con errores
                    return response.text().then(html => {
                        modalBodyPedido.innerHTML = html;
                        attachFormListenerPedido();
                        // Volver a llamar calcularPrecio cuando hay errores
                        calcularPrecio();
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

const closeModalPedido = () => {
    modalOverlayPedido.classList.remove('active');
    document.body.style.overflow = 'auto';
    modalBodyPedido.innerHTML = '';
}

btnOpenModalPedido.addEventListener('click', openModalPedido);
btnCloseModalPedido.addEventListener('click', closeModalPedido);

modalOverlayPedido.addEventListener('click', (e) => {
    if (e.target === modalOverlayPedido) {
        closeModalPedido();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlayPedido.classList.contains('active')) {
        closeModalPedido();
    }
});

// funcion para agregar un nuevo detalle de pedido al formulario del modal, esta funcion se llama cada vez que se abre el modal, asi aseguramos que el boton de agregar producto funcione correctamente cada vez que se carga el formulario en el modal
const attachAgregarProductoListener = () => {
    const btnAgregar = document.querySelector('#modalBodyPedido .btn-agregar-detalle');
    // Si no se encuentra el botón, salir de la función
    if (!btnAgregar) return;
    
    btnAgregar.addEventListener('click', (e) => {
        e.preventDefault();
        const container = document.querySelector('#modalBodyPedido #detalles-pedido-container');
        const totalFormsInput = document.querySelector('#modalBodyPedido [name="detallepedido_set-TOTAL_FORMS"]');
        const currentFormCount = parseInt(totalFormsInput.value);
        
        // Crear nueva fila
        const newRow = document.createElement('div');
        newRow.className = 'detalle-pedido';
        newRow.innerHTML = `
            <label>Producto:</label>
            <select name="detallepedido_set-${currentFormCount}-producto" id="id_detallepedido_set-${currentFormCount}-producto">
                <option value="">--- Selecciona un producto ---</option>
            </select>
            
            <label>Cantidad:</label>
            <input type="number" name="detallepedido_set-${currentFormCount}-cantidad" id="id_detallepedido_set-${currentFormCount}-cantidad" min="1">
            
            <label>Precio:</label>
            <input type="text" name="detallepedido_set-${currentFormCount}-precio_pedido" id="id_detallepedido_set-${currentFormCount}-precio_pedido" disabled>
        `;
        
        container.appendChild(newRow);
        totalFormsInput.value = currentFormCount + 1;
        
        // Llenar opciones de productos
        const productoSelect = newRow.querySelector('select');
        const firstSelect = document.querySelector('#modalBodyPedido [name*="-producto"]');
        if (firstSelect) {
            const options = firstSelect.innerHTML;
            productoSelect.innerHTML = options;
        }
        
        calcularPrecio();
        calcularPrecioTotal();

        // boton para eliminar el detalle de pedido
        const eliminarBtn = document.createElement('button');
        eliminarBtn.type = 'button';
        eliminarBtn.textContent = 'Eliminar';
        eliminarBtn.className = 'btn-eliminar-detalle';
        newRow.appendChild(eliminarBtn);

        eliminarBtn.addEventListener('click', () => {
            newRow.remove();
            calcularPrecioTotal();
        });
    });
};