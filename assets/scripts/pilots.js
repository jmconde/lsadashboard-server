var mymap = L.map('map-container');
var mapEl = document.querySelector('#map');

function showMap(ev) {
    const { lat, lon } = ev.currentTarget.dataset;
    const { x, y } = ev;
    mapEl.style.display = 'block';
    mapEl.style.top = `${y - 150}px`;
    mapEl.style.left = `${x + 20}px`;
    mymap.setView([lat, lon], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {
        foo: 'bar',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap);
}

function hideMap() {
    mapEl.style.display = 'none';
}

document.querySelectorAll('.location-link').forEach((el) => {
    el.addEventListener('mouseover', showMap);
    el.addEventListener('mouseout', hideMap);
});