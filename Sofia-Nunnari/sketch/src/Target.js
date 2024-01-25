let avantiButton = document.getElementById("avanti");

avantiButton.addEventListener("click", function(){
    window.location.href = "Pagina-1.html"
})

mapboxgl.accessToken = 'MAPBOX_KEY';
const map = new mapboxgl.Map({
    container: 'map',
    zoom: 18,
    center: [8.978787, 45.868885],
    pitch: 45,
    bearing: 10,
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/lionessy/cloygpht9012j01pmggm8ckyg',
    interactive: false
});



const size = 200;

// This implements `StyleImageInterface`
// to draw a pulsing dot icon on the map.
const pulsingDot = {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),

    // When the layer is added to the map,
    // get the rendering context for the map canvas.
    onAdd: function () {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
    },

    // Call once before every frame where the icon will be used.
    render: function () {
        const duration = 1000;
        const t = (performance.now() % duration) / duration;

        const radius = (size / 2) * 0.3;
        const outerRadius = (size / 2) * 0.7 * t + radius;
        const context = this.context;

        // Draw the outer circle.
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
        );
        context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
        context.fill();

        // Draw the inner circle.
        context.beginPath();
        context.arc(
            this.width / 2,
            this.height / 2,
            radius,
            0,
            Math.PI * 2
        );
        context.fillStyle = 'rgba(255, 100, 100, 1)';
        context.strokeStyle = 'white';
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        // Update this image's data with data from the canvas.
        this.data = context.getImageData(
            0,
            0,
            this.width,
            this.height
        ).data;

        // Continuously repaint the map, resulting
        // in the smooth animation of the dot.
        map.triggerRepaint();

        // Return `true` to let the map know that the image was updated.
        return true;
    }
};

map.on('style.load', () => {

    const layers = map.getStyle().layers;
    const labelLayerId = layers.find(
        (layer) => layer.type === 'symbol' && layer.layout['text-field']
    ).id;

    map.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 25
    });
    map.addLayer(
        {
            'id': 'add-3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
                'fill-extrusion-color': '#2d3957',

                // Use an 'interpolate' expression to
                // add a smooth transition effect to
                // the buildings as the user zooms in.
                'fill-extrusion-height': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15,
                    0,
                    15.05,
                    ['get', 'height']
                ],
                'fill-extrusion-base': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15,
                    0,
                    15.05,
                    ['get', 'min_height']
                ],
                'fill-extrusion-opacity': 0.5
            }
        },
        labelLayerId
    );
    map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 2 });
    map.addSource('trace', {
        type: 'geojson',
        data: {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'LineString',
                'coordinates': targetRoute
            }
        }
    });
    
    map.addLayer({
        type: 'line',
        source: 'trace',
        id: 'line',
        paint: {
            'line-color': 'red',
            'line-width': 15
        },
        layout: {
            'line-cap': 'round',
            'line-join': 'round'
        }
    });
});

map.on('load', () => {
    // wait for the terrain and sky to load before starting animation

    const elem = document.getElementsByClassName("anim");
    // Add or remove the 'collapsed' CSS class from the sidebar element.
    // Returns boolean "true" or "false" whether 'collapsed' is in the class list.
    Array.from(elem).forEach(element => {
        element.classList.toggle('collapsed');
    });


    map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

    map.addSource('dot-point', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [8.978787, 45.868885] // icon position [lng, lat]
                    }
                }
            ]
        }
    });
    map.addLayer({
        'id': 'layer-with-pulsing-dot',
        'type': 'symbol',
        'source': 'dot-point',
        'layout': {
            'icon-image': 'pulsing-dot'
        }
    });
    window.requestAnimationFrame(frame);
});