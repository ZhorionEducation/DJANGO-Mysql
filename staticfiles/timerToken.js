const containerTimerTokenHTML = document.querySelector('#timerToken');
const containerExpiry = document.querySelector('.container-expiry');

const fetchTokenExpiration = () => {
    fetch('https://web-production-6ef9e.up.railway.app/token-expiry', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const expirationTime = new Date(data.expiry);
        
        // Actualizar cada segundo
        setInterval(() => {
            const now = new Date();
            const timeLeft = Math.max(0, expirationTime - now);
            updateTimer(timeLeft);
        }, 1000);
    })
    .catch(error => {
        console.error('Error fetching token expiration:', error);
        containerTimerTokenHTML.textContent = 'Error';
    });
};

const updateTimer = (timeLeft) => {
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Mostrar si falta 1 minuto o menos
    if (timeLeft <= 60000 && timeLeft > 0) {
        containerExpiry.classList.add('show');
        containerTimerTokenHTML.textContent = formattedTime;
    } else if (timeLeft === 0) {
        containerTimerTokenHTML.textContent = '00:00';
    } else {
        containerExpiry.classList.remove('show');
    }
};

document.addEventListener('DOMContentLoaded', fetchTokenExpiration);