const btnEliminarCliente = document.querySelectorAll('#eliminarCliente');

const eliminarCliente = (id) => {
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
            // Hacer la petición POST para eliminar el cliente la url debe coincidir con la url definida en urls.py para eliminar cliente
            fetch(`/tienda/clientes/${id}/eliminar/`, {
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
                    text: 'Ocurrió un error al eliminar el cliente.',
                });
            });
        }
    });
};

// Agregar event listener a cada botón de eliminar cliente
btnEliminarCliente.forEach(button => {
    button.addEventListener('click', (event) => {
        // prevenimos el comportamiento por defecto del enlace
        event.preventDefault();
        // obtenemos el id del cliente desde el atributo data-cliente-id del boton
        const clienteId = button.getAttribute('data-cliente-id');
        // llamamos a la función para eliminar el cliente
        eliminarCliente(clienteId);
    });
});

// Función para obtener el token CSRF de las cookies, necesario para las peticiones POST en Django
const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}