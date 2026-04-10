const showLoader = () => {
    document.querySelector('#loader').style.display = 'flex';
}

const hideLoader = () => {
    document.querySelector('#loader').style.display = 'none';
}

// ocultar cuando carga la pagina
window.addEventListener('load', hideLoader);

// detectar navegacion
window.addEventListener('DOMContentLoaded', () => {
    // Interceptar clicks en enlaces
    document.querySelectorAll('a', 'button').forEach(link => {
        link.addEventListener('click', () => {

            if(link.hasAttribute('data-no-loader')) {
                return; // No mostrar loader para este enlace
            }
            showLoader();
        });
    });

    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', () => {
            showLoader();
        });
    });
});

// interceptar fetch

const originalFetch = window.fetch;

window.fetch = async( url, options ={} ) => {
    const { noLoader, ...fetchOptions } = options;

    if (!noLoader) {
        showLoader();
    }
    try {
        const response = await originalFetch(url, fetchOptions);
        return response;
    } catch (error) {
        throw error;
    } finally {
        if (!noLoader) {
            hideLoader();
        }
    }
};