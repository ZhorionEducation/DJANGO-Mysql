const btnEliminarProducto = document.querySelectorAll('#btnEliminarProducto');

const eliminarProducto = (id) => {
    // Primero mostrar confirmación
    Swal.fire({
        icon: 'warning',
        title: '¿Estás seguro?',
        text: 'No podrás revertir esta acción',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        // Si el usuario confirma, entonces hacer el fetch
        if (result.isConfirmed) {
            // Hacer la petición POST para eliminar el producto la url debe coincidir con la url definida en urls.py para eliminar producto
            fetch(`/tienda/productos/${id}/eliminar/`, {
                method: 'POST',
                // Incluir el token CSRF en los headers para que Django permita la peticion
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                }
            })
            .then(response => response.json())
            .then(data => {
                // Si la respuesta es correcta mostrar mensaje de exito
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: data.message,
                        timer: 2000,
                        showConfirmButton: false
                    }).then(() => {
                        location.reload();
                    });
                // Si la respuesta es incorrecta mostrar mensaje de error
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.message,
                    });
                }
            })
            // capturamos cualquier error de parte del servidor o de la red
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al eliminar el producto.',
                });
            });
        }
    });
};

btnEliminarProducto.forEach(btn => {
    btn.addEventListener('click', () => {
        const productoId = btn.getAttribute('data-producto-id');
        eliminarProducto(productoId);
    });
});

// Función para obtener el token CSRF de las cookies
const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Verificar si esta cookie coincide con el nombre que buscamos
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};