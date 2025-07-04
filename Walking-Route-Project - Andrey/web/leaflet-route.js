const map = L.map('map').setView([42.6977, 23.3219], 14);

// Добавяме OpenStreetMap слой
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Маркер за текущо местоположение (просто фиксирано тук)
const userMarker = L.marker([42.6977, 23.3219]).addTo(map).bindPopup("Текущо местоположение").openPopup();

let routeLine = null;
let timerInterval;
let timeLeft = 3 * 60 * 60; // 3 часа в секунди

// Зареждаме маршрутния файл
async function loadRoute() {
    const response = await fetch('../data/route.json');
    const coords = await response.json();
    return coords.map(c => [c[0], c[1]]);
}

// Показване на маршрута на картата
async function drawRoute() {
    if (routeLine) {
        map.removeLayer(routeLine);
    }
    const routeCoords = await loadRoute();

    routeLine = L.polyline(routeCoords, {color: 'red'}).addTo(map);
    map.fitBounds(routeLine.getBounds());
}

// Таймер
function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 3 * 60 * 60; // 3 часа

    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert('Обиколката приключи!');
            return;
        }
        timeLeft--;
        const h = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
        const m = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
        const s = String(timeLeft % 60).padStart(2, '0');
        document.getElementById('timer').textContent = `Таймер: ${h}:${m}:${s}`;
    }, 1000);
}

document.getElementById('startTour').addEventListener('click', () => {
    drawRoute();
    startTimer();
});
