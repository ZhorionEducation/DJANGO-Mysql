const calcularPrecio = () => {
    // Selecciono todos los selects de producto
    const productoSelects = document.querySelectorAll('[id^="producto-"], [name*="-producto"]');
    
    // Para cada select, agrego un event listener para detectar cambios
    productoSelects.forEach((select, index) => {
        // Para los que tienen id, extraer el índice del ID (producto-0, producto-1, etc)
        // Para los que tienen name, extraer del name (detallepedido_set-0-producto)
        let actualIndex;
        if (select.id.startsWith('producto-')) {
            actualIndex = select.id.replace('producto-', '');
        } else {
            actualIndex = select.name.match(/detallepedido_set-(\d+)-/)[1];
        }
        
        // Obtener los inputs correspondientes
        const cantidadInput = document.getElementById(`cantidad-${actualIndex}`) || 
                             document.querySelector(`input[name="detallepedido_set-${actualIndex}-cantidad"]`);
        const precioInput = document.getElementById(`precio-${actualIndex}`) || 
                           document.querySelector(`input[name="detallepedido_set-${actualIndex}-precio_pedido"]`);
        
        // Listener cuando cambia el producto
        select.addEventListener('change', () => {
            actualizarPrecio(actualIndex, precioInput, cantidadInput, select);
            calcularPrecioTotal();
        });
        
        // Listener cuando cambia la cantidad
        if (cantidadInput) {
            cantidadInput.addEventListener('input', () => {
                actualizarPrecio(actualIndex, precioInput, cantidadInput, select);
                calcularPrecioTotal();
            });
        }
    });
};

// Función para actualizar precio de un detalle
const actualizarPrecio = (index, precioInput, cantidadInput, select) => {
    const cantidad = cantidadInput.value;
    // Obtener el texto del producto para extraer el precio
    const selectedText = select.options[select.selectedIndex].text;
    const precioUnitario = selectedText.split('$')[1];
    
    // Si hay un producto seleccionado y una cantidad, calculamos el precio total
    if (precioUnitario && cantidad) {
        const precioTotal = precioUnitario * cantidad;
        precioInput.value = precioTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else {
        precioInput.value = '0.00';
    }
};

// Función para calcular el precio total del pedido
const calcularPrecioTotal = () => {
    const precioTotalInput = document.getElementById('precio-total');
    if (!precioTotalInput) return;
    
    // Seleccionar todos los campos de precio de detalles
    const precioDetalles = document.querySelectorAll('input[name*="-precio_pedido"]');
    
    let total = 0;
    precioDetalles.forEach(input => {
        // el ? es para manejar el caso donde el input no tenga valor o esté vacío
        const valor = input.value ? parseFloat(input.value.replace(/,/g, '')) : 0;
        total += valor;
    });
    
    // preciototalinput formateado con separadores
    precioTotalInput.value = total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
};

calcularPrecio();