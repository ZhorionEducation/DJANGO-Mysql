// Modal Nativo para ver detalles del pedido

const botonesVerDetalle = document.querySelectorAll('.btn-ver-detalle');
const modalOverlay = document.querySelector('#modalDetallePedido');
const btnCloseModal = document.querySelector('#btnCloseModalDetalle');
const modalBody = document.querySelector('#modalDetallePedido .modal-body');

// Abrimos el modal con esta función
const openModal = (pedidoId) => {
    // fetch carga el HTML con los detalles del pedido
    fetch(`/tienda/pedidos/${pedidoId}/`)
        .then(response => response.text())
        .then(html => {
            modalBody.innerHTML = html;
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            // Calcular el total después de cargar el contenido
            calcularTotalPedido();
        })
        .catch(error => {
            console.error('Error al cargar los detalles:', error);
        });
}

// Función para cerrar el modal
const closeModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    modalBody.innerHTML = '';
}

// Event listeners para los botones de ver detalle
botonesVerDetalle.forEach(boton => {
    boton.addEventListener('click', () => {
        const pedidoId = boton.getAttribute('data-pedido-id');
        openModal(pedidoId);
    });
});

// Cerrar modal
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

const totalPedidoElement = document.querySelector('#totalPedido');
// Función para calcular el total del pedido sumando los subtotales de cada detalle
const calcularTotalPedido = () => {
    // Buscar el elemento cada vez que se llama (importante para modales)
    const totalElement = document.querySelector('#totalPedido');
    if (!totalElement) return; // Si no existe, salir
    
    let total = 0;
    const subtotales = document.querySelectorAll('#subtotales');
    subtotales.forEach(subtotal => {
        // implemento dos replace aca porque el precio viene con formato de miles (ej: $1,234.56) y el parseFloat no lo reconoce, entonces primero elimino el símbolo de dólar y luego las comas
        total += parseFloat(subtotal.textContent.replace('$', '',).replace(/,/g, '')) || 0;
    });
    // aca muestro el total formateado con comas y dos decimales
    totalElement.textContent = `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};




