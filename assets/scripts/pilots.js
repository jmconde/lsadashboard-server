const locationMap = L.map('map-container');
const mapEl = document.querySelector('#map');

const markerTakeoff = L.icon({
    iconUrl: '/images/marker-takeoff.png',
    iconSize: [21, 32],
    iconAnchor: [10, 32]
});

const markerLanding = L.icon({
    iconUrl: '/images/marker-landing.png',
    iconSize: [21, 32],
    iconAnchor: [10, 32]
});

const markerHere = L.icon({
    iconUrl: '/images/marker-here.png',
    iconSize: [21, 32],
    iconAnchor: [10, 32]
});

const tiles = [
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
    'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png'
];

L.tileLayer(tiles[4], {
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
    L.marker([lat, lon], { icon: markerHere }).addTo(layerGroup);
}

function showRouteMap(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    const target = ev.currentTarget;
    const { lat, lon, prevlat, prevlon } = target.dataset;
    layerGroup.clearLayers();
    document.querySelector('#map-modal').classList.add('is-active');
    L.marker([lat, lon], { icon: markerLanding }).addTo(layerGroup);
    L.marker([prevlat, prevlon], {icon: markerTakeoff}).addTo(layerGroup);
    var latlngs = [
        [prevlat, prevlon],
        [lat, lon]
    ];
    var polyline = L.polyline(latlngs, {
        color: '#DA53D4',
        weight: 1,
        dashArray: '6 3 2 3'
    }).addTo(layerGroup);

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
