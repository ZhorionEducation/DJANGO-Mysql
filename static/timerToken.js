const containerTimerTokenHTML = document.querySelectorAll('#timerToken');

const fetchTokenExpiration = () => {
    fetch('https://web-production-6ef9e.up.railway.app/token-expiry'), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }

    }
    .then(response => response.json())
    .then(data => {
        const expirationTime = new Date(data.expiration);
        const now = new Date();
        const timeLeft = Math.max(0, expirationTime - now);
        updateTimer(timeLeft);
    })
    .catch(error => {
        console.error('Error fetching token expiration:', error);
        containerTimerTokenHTML.forEach(span => span.textContent = 'Error');
    });
};

const updateTimer = (timeLeft) => {
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    containerTimerTokenHTML.forEach(span => span.textContent = formattedTime);
};