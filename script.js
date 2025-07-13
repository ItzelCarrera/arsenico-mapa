// =============================
// Configuración Inicial del Mapa
// =============================

// Capas base
var capa1 = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=2b965822-ba3f-4bff-9fdd-f1038c96fb9f', {
  maxZoom: 20,
  attribution: '&copy; Stadia Maps, &copy; OpenMapTiles, &copy; OpenStreetMap'
});

var capa2 = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

var capa3 = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=2b965822-ba3f-4bff-9fdd-f1038c96fb9f');

var capaEsriSat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles © Esri'
});

var capaEsriTopo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles © Esri'
});

var capaCartoLight = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; CartoDB'
});

var capaCartoDark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; CartoDB'
});

// Crear el mapa
var map = L.map('map', {
  center: [28.67, -106.1],
  zoom: 11,
  layers: [capa1] // capa inicial
});

// =============================
// Minimapa
// =============================
new L.Control.MiniMap(capa2, {
  toggleDisplay: true,
  minimized: false,
  position: 'bottomleft'
}).addTo(map);

// =============================
// Escala
// =============================
L.control.scale().addTo(map);

// =============================
// Panel de Información
// =============================
var infoControl = L.control({ position: 'topright' });
infoControl.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info-box');
  div.innerHTML = "<b>Información de la muestra:</b><br><div id='info-texto'>Selecciona un punto dentro de las zonas.</div>";
  return div;
};
infoControl.addTo(map);

// =============================
// Datos de Puntos
// =============================
var puntos = [
  { nombre: "A-01", grupo: "A", lat: 28.7356, lng: -106.124055, arsenico: 15.052, arsenico_lluvias: 17.928 },
  { nombre: "A-02", grupo: "A", lat: 28.73836, lng: -106.13267, arsenico: 16.905 },
  { nombre: "A-03", grupo: "A", lat: 28.74376, lng: -106.132388, arsenico: 12.387 },
  { nombre: "B-04", grupo: "B", lat: 28.66911, lng: -106.112844, arsenico: 6.399 },
  { nombre: "B-05", grupo: "B", lat: 28.65202, lng: -106.138525, arsenico: 7.482 },
  { nombre: "B-06", grupo: "B", lat: 28.66207, lng: -106.127324, arsenico: 4.529 },
  { nombre: "C-07", grupo: "C", lat: 28.64531, lng: -106.02162, arsenico: 12.862 },
  { nombre: "C-08", grupo: "C", lat: 28.62303, lng: -106.01914, arsenico: 11.428 },
  { nombre: "C-09", grupo: "C", lat: 28.62859, lng: -106.02545, arsenico: 13.079 }
];

var colores = { A: "red", B: "blue", C: "green" };

puntos.forEach(function(punto) {
  const marker = L.circleMarker([punto.lat, punto.lng], {
    radius: 10,
    color: colores[punto.grupo],
    fillColor: colores[punto.grupo],
    fillOpacity: 0.5
  }).addTo(map).bindPopup(`<b>${punto.nombre}</b>`);

  marker.on('click', function() {
    const ars = punto.arsenico;
    const ars_lluvias = punto.arsenico_lluvias;
    const colorAs = ars > 10 ? 'red' : 'green';
    const colorAsLluvias = ars_lluvias !== undefined ? (ars_lluvias > 10 ? 'red' : 'green') : null;

    let contenido = `
      <b>${punto.nombre}</b><br>
      <b>Límite permisible:</b> <span style="color:orange">10 µg/L</span><br>
      <b>Concentración As:</b> <span style="color:${colorAs}">${ars} µg/L</span><br>
    `;

    if (ars_lluvias !== undefined) {
      contenido += `<b>As posterior a lluvias:</b> <span style="color:${colorAsLluvias}">${ars_lluvias} µg/L</span><br>`;
    }

    contenido += `<b>Coordenadas:</b> Lat: ${punto.lat.toFixed(5)}, Lng: ${punto.lng.toFixed(5)}`;
    document.getElementById('info-texto').innerHTML = contenido;
  });
});

// =============================
// Zonas y Etiquetas
// =============================
var zonas = [
  { nombre: "Zona A", lat: 28.7399, lng: -106.1297, offsetLat: 0.015, offsetLng: 0, color: "red" },
  { nombre: "Zona B", lat: 28.658611, lng: -106.125556, offsetLat: 0.012, offsetLng: 0, color: "blue" },
  { nombre: "Zona C", lat: 28.6323, lng: -106.0221, offsetLat: -0.02, offsetLng: 0, color: "green" }
];

zonas.forEach(function(zona) {
  L.circle([zona.lat, zona.lng], {
    radius: 2000,
    color: zona.color,
    fillOpacity: 0,
    weight: 2,
    dashArray: '6, 6',
    interactive: false
  }).addTo(map);

  L.marker([zona.lat + zona.offsetLat, zona.lng + zona.offsetLng], {
    icon: L.divIcon({
      className: 'zona-label',
      html: `<b>${zona.nombre}</b>`,
      iconSize: [100, 20]
    })
  }).addTo(map);
});

// =============================
// Leyenda
// =============================
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function () {
  var div = L.DomUtil.create('div', 'legend');
  div.innerHTML += "<strong>Leyenda</strong><br>";
  div.innerHTML += "<span class='color-rojo'></span> Zona A (Norte)<br>";
  div.innerHTML += "<span class='color-azul'></span> Zona B (Centro)<br>";
  div.innerHTML += "<span class='color-verde'></span> Zona C (Sur)<br>";
  return div;
};
legend.addTo(map);

// =============================
// Capas WMS del INEGI
// =============================
var capaCuencas = L.tileLayer.wms('https://gaia.inegi.org.mx/NLB/tunnel/wms/wms61?', {
  layers: 'c400',
  format: 'image/png',
  transparent: true,
  version: '1.1.1'
});

// =============================
// Control de capas
// =============================
var baseMaps = {
  "Claro Stadia": capa1,
  "OSM": capa2,
  "Oscuro Stadia": capa3,
  "Esri Satélite": capaEsriSat,
  "Esri Topográfico": capaEsriTopo,
  "Carto Light": capaCartoLight,
  "Carto Dark": capaCartoDark
};

var overlayMaps = {
  "Áreas de concentración pozos INEGI Aguas Subterráneas 1:250 000 (1996-2008)": capaCuencas
};

L.control.layers(baseMaps, overlayMaps).addTo(map);

// =============================
// Botón de Imprimir
// =============================
L.easyButton(`<img src="print.jpg" style="width:20px; height:20px;">`, function(btn, map){
  window.print();
}, 'Imprimir mapa').addTo(map);
