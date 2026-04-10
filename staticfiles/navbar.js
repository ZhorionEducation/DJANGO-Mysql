const hamburger = document.getElementById('hamburger');
const navVertical = document.getElementById('navVertical');
const navLinks = navVertical.querySelectorAll('a');

// Toggle menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navVertical.classList.toggle('active');
});

// Cerrar menú al hacer clic en un link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navVertical.classList.remove('active');
    });
});

// Cerrar menú si se hace clic fuera
document.addEventListener('click', (e) => {
    if (!e.target.closest('.hamburger') && !e.target.closest('.nav-vertical')) {
        hamburger.classList.remove('active');
        navVertical.classList.remove('active');
    }
});