//const BASE_URL_NOMINATIM = 'https://api.mapbox.com/geocoding/v5/mapbox.places/9.055550697500166,45.563576824324656.json?country=it&language=it&access_token=pk.eyJ1IjoibGlvbmVzc3kiLCJhIjoiY2xvd29kenFoMTZnNjJrcXdjdXV1d3RvNiJ9.9Mh9rJULy8FDYo0NMl9RwA';

let intervallo;

let avantiButton = document.getElementById("indietro");

avantiButton.addEventListener("click", function () {
    window.location.href = "index.html"
})

mapboxgl.accessToken = 'pk.eyJ1IjoibGlvbmVzc3kiLCJhIjoiY2xvd29kenFoMTZnNjJrcXdjdXV1d3RvNiJ9.9Mh9rJULy8FDYo0NMl9RwA';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/lionessy/cloygpht9012j01pmggm8ckyg',
    center: [8.978300, 45.870973],
    zoom: 16.5,
    pitch: 45,
});

const start = [8.978200, 45.870273];

// Pulsing Dot
const size = 125;
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

// Animazione del Pulsing Dot
function frame(time) {
    const dotSource = map.getSource('dot-point');
    dotSource.setData({
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [8.979450, 45.870900] // icon position [lng, lat]
                }
            }
        ]
    });

    window.requestAnimationFrame(frame);
}

map.on('load', () => {
    getRoute(start);

    map.addLayer({
        'id': 'point',
        'type': 'circle',
        'source': {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': [
                    {
                        'type': 'Feature',
                        'properties': {},
                        'geometry': {
                            'type': 'Point',
                            'coordinates': start
                        }
                    }
                ]
            }
        },
        'paint': {
            'circle-radius': 10,
            'circle-color': 'white'
        }
    });

    // Add Pulsing Dot to the map
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

    // Allow the user to click the map to change the destination
    map.on('click', (event) => {
        const coords = Object.keys(event.lngLat).map((key) => event.lngLat[key]);
        const end = {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'Point',
                        'coordinates': coords
                    }
                }
            ]
        };
        if (map.getLayer('end')) {
            map.getSource('end').setData(end);
        } else {
            map.addLayer({
                'id': 'end',
                'type': 'circle',
                'source': {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': [
                            {
                                'type': 'Feature',
                                'properties': {},
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': coords
                                }
                            }
                        ]
                    }
                },
                'paint': {
                    'circle-radius': 10,
                    'circle-color': 'white'
                }
            });
        }
        getRoute(coords);
    });

    // Start the animation loop
    window.requestAnimationFrame(frame);
});

async function getRoute(end) {
    // Make directions request using walking profile
    const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
    );
    const json = await query.json();
    const data = json.routes[0];
    let route = data.geometry.coordinates;
    const geojson = {
        'type': 'Feature',
        'properties': {},
        'geometry': {
            'type': 'LineString',
            'coordinates': route
        }
    };

    // if the route already exists on the map, we'll reset it using setData
    if (map.getSource('route')) {
        map.getSource('route').setData(geojson);
    }
    // otherwise, we'll make a new request
    else {
        map.addLayer({
            'id': 'route',
            'type': 'line',
            'source': {
                'type': 'geojson',
                'data': geojson
            },
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': 'white',
                'line-width': 5,
                'line-opacity': 0.75
            }
        });
    }

    // Reverse the order of coordinates for backward animation
    route = route.reverse();

    // get the sidebar and add the instructions
    const instructions = document.getElementById('instructions');
    const steps = data.legs[0].steps;

    let tripInstructions = '';
    for (const step of steps) {
        tripInstructions += `<li>${step.maneuver.instruction}</li>`;
    }
    instructions.innerHTML = `<strong>Duration: ${Math.floor(
        data.duration / 60
    )} min </strong><ol>${tripInstructions}</ol>`;

    document.querySelectorAll('li').forEach((item) => {
        item.style.display = 'none';
    })

    function leggiTesto(testo, lingua, callback) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(testo);

        // Imposta la lingua desiderata
        utterance.lang = lingua;

        // Aggiungi un ascoltatore per l'evento 'end'
        utterance.onend = callback;

        document.addEventListener('click', function() {
            if (synth.speaking) {
                // Se la sintesi vocale è già in corso, interrompila prima di avviarne una nuova
                synth.cancel();
            }
    
            // Avvia la sintesi vocale
            synth.speak(utterance);
        });
    }

    clearInterval(intervallo)
    let num_li = document.querySelectorAll('li').length;
    let current = 0;
    document.querySelectorAll('li')[current].style.display = 'block';

    intervallo = setInterval(() => {
        document.querySelectorAll('li').forEach((item) => {
            item.style.display = 'none';
        })

        document.querySelectorAll('li')[current].style.display = 'none';

        // Leggi il testo dell'istruzione corrente in inglese
        const istruzioneCorrente = document.querySelectorAll('li')[current].innerText;

        // Funzione di callback chiamata quando la voce ha finito di leggere un'istruzione
        const callback = () => {
            if (current < num_li - 1) {
                document.querySelectorAll('li')[current + 1].style.display = 'block';
                current++;
            } else {
                current = 0;
                document.querySelectorAll('li')[current].style.display = 'block';
            }
        };
        leggiTesto(istruzioneCorrente, 'en-US', callback);
    }, 5000);

    // Effetto di volo d'uccello
    map.flyTo({
        center: route[0], // imposta il centro sulla prima coordinata del percorso
        zoom: 16.5,
        essential: true, // this animation is considered essential with respect to prefers-reduced-motion
        duration: 5000
    });
}

map.on('load', () => {
    // make an initial directions request that
    // starts and ends at the same location
    getRoute(start);

    // Add destination to the map
    map.addLayer({
        'id': 'point',
        'type': 'circle',
        'source': {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': [
                    {
                        'type': 'Feature',
                        'properties': {},
                        'geometry': {
                            'type': 'Point',
                            'coordinates': start
                        }
                    }
                ]
            }
        },
        'paint': {
            'circle-radius': 10,
            'circle-color': 'white'
        }
    });

    // allow the user to click the map to change the destination
    function calculateDistance(coord1, coord2) {
        const line = turf.lineString([coord1, coord2]);
        const distance = turf.length(line, { units: 'meters' });
        return distance;
    }

    let end = {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'Point',
                    'coordinates': [8.978787, 45.868885] // Coordinata di destinazione predefinita
                }
            }
        ]
    };

    map.on('click', async (event) => {
        const coords = Object.keys(event.lngLat).map((key) => event.lngLat[key]);

        // Aggiorna la posizione del punto di destinazione
        end = {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'Point',
                        'coordinates': coords
                    }
                }
            ]
        };

        if (map.getLayer('end')) {
            map.getSource('end').setData(end);
        } else {
            map.addLayer({
                'id': 'end',
                'type': 'circle',
                'source': {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': [
                            {
                                'type': 'Feature',
                                'properties': {},
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': coords
                                }
                            }
                        ]
                    }
                },
                'paint': {
                    'circle-radius': 10,
                    'circle-color': 'white'
                }
            });
        }
        getRoute(coords);
    });
});