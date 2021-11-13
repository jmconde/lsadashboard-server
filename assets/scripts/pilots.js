const locationMap = L.map('map-container');
const mapEl = document.querySelector('#map');


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {
    foo: 'bar',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(locationMap);

const layerGroup =  L.layerGroup().addTo(locationMap);

function showLocationMap(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    const target = ev.currentTarget;
    const { lat, lon } = target.dataset;
    layerGroup.clearLayers();
    document.querySelector('#map-modal').classList.add('is-active');
    locationMap.setView([lat, lon], 12);
    L.marker([lat, lon]).addTo(layerGroup);
}

function showRouteMap(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    const target = ev.currentTarget;
    const { lat, lon, prevlat, prevlon } = target.dataset;
    layerGroup.clearLayers();
    document.querySelector('#map-modal').classList.add('is-active');
    L.marker([lat, lon]).addTo(layerGroup);
    L.marker([prevlat, prevlon]).addTo(layerGroup);
    var latlngs = [
        [prevlat, prevlon],
        [lat, lon]
    ];
    var polyline = L.polyline(latlngs, {color: 'red'}).addTo(layerGroup);

    // zoom the map to the polyline
    locationMap.fitBounds(polyline.getBounds());
}

function closeModals(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    document.querySelectorAll('.modal').forEach((el) => {
        el.classList.remove('is-active');
    });
}

document.querySelectorAll('.modal-close, #map-modal .modal-background').forEach((el) => {
    el.addEventListener('click', closeModals);
});
document.querySelectorAll('.location-link').forEach((el) => {
    el.addEventListener('click', showLocationMap);
});
document.querySelectorAll('.route-link').forEach((el) => {
    el.addEventListener('click', showRouteMap);
});
