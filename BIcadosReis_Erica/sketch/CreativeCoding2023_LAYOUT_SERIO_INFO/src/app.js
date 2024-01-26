//variabili
const outputElement = document.getElementById('output');
const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

//array per mantenere le immagini e le descrizio
let imageDescriptions = []; 

// PARTE CAMERA
//Funzione per avviare la camera
async function startCamera() {
    try {
        //restrizioni per la fotocamera
        const constraints = {
            audio: false,
            video: {
                facingMode: "environment", //tipo di fotocamera, in questo caso esterna
                width: 700, // larghezza ideale
                height: 700, // altezza ideale
                left: 0,
                right: 0,

            }
        };

        //accesso alla fotocamera
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        if ("srcObject" in video) {
            video.srcObject = stream;
        } else {
            video.src = window.URL.createObjectURL(stream);
        }

    } catch (error) {
        console.error('Error accessing camera:', error);
    }
}

//Funzione per visualizzare l'immagine
function displayCapturedImage(imgId, imgSrc, descriptionText, captureDate) {
    const imageData = {
        id: imgId,
        src: imgSrc,
        description: descriptionText,
        date: captureDate
    };

    //aggiungi l'oggetto all'inizio dell'array
    imageDescriptions.unshift(imageData);
    document.querySelector("#capture").innerHTML = "Capture image";
    //aggiorna l'output ogni volta che viene catturata una nuova immagine
    updateOutput(); 
}

//Funzione per catturare l'immagine dalla fotocamera
async function captureImage() {
    //indicatore di caricamento
    document.querySelector("#capture").innerHTML = "loading ..." 
    context.canvas.width = video.videoWidth;
    context.canvas.height = video.videoHeight;
    //mantenere l'immagine catturata nello schermo
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    const imgSrc = canvas.toDataURL('image/png');
    //ottenere la data e l'ora dello scatto
    const currentDate = new Date();
    const captureDate = currentDate.toISOString(); 
    //ottenere la rilevazione e la descrizione degli oggetti nella fotografia
    const objectRecognized = await detectObjectsGoogleVision(imgSrc);
    const cohereDescription = await generateDescription(objectRecognized);
    //visualizzare tutte le immagini catturate nella pagina
    displayCapturedImage(imageDescriptions.length + 1, imgSrc, cohereDescription, captureDate);

}

//Funzione per la visualizzazione della data e dell'ora
function formatDateTime(date) {
    const options = {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
    };
    return date.toLocaleString('en-US', options).replace(',', ''); 
}

//Funzione per aggiornare l'output quando le immagini sono generate
function updateOutput() {
    let containers = document.getElementById('imageContainer');
    containers.innerHTML = '';
    //aggiungi le immagini e le descrizioni nel modo corretto
    for (let i = 0; i < imageDescriptions.length; i++) {
        const desc = imageDescriptions[i];
        let imgContainer = document.createElement('div');
        imgContainer.className = 'image-container';
        const img = new Image();
        img.src = desc.src;
        imgContainer.appendChild(img);
        const description = document.createElement('p');
        const formattedDate = formatDateTime(new Date(desc.date));
        description.textContent = `${formattedDate} - ${desc.description}`;
        imgContainer.appendChild(description);
        containers.appendChild(imgContainer);
    }
}

//outputElement.innerHTML

//Funzione per la rilevazione degli oggetti nell'immagine tramite Google Vision API
async function detectObjectsGoogleVision(imgSrc) {
    const apiKey = 'AIzaSyConyle9qljRMYS9VwR4a8ZlUUEoY6aRwk';
    const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

    const base64Image = imgSrc.split(',')[1];
    //costruzione dei dati
    const requestData = {
        requests: [
            {
                image: {
                    content: base64Image,
                },
                features: [
                    {
                        type: 'OBJECT_LOCALIZATION',
                        maxResults: 5,
                    },
                ],
            },
        ],
    };

    try {
        //richiesta all'API di Google Vision
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });
        //elaborazione dei dati
        const data = await response.json();
        const objects = data.responses[0].localizedObjectAnnotations;
        //resituzione dei nomi degli oggetti rilevati o messaggio se non sono stati rilevati oggetti
        if (objects.length > 0) {
            const objectNames = objects.map((obj) => obj.name).join(', ');
            return objectNames;
        } else {
            return 'Nessun oggetto riconosciuto';
        }
    } catch (error) {
        console.error('Errore nella richiesta Google Vision API:', error);
        return 'Errore nella rilevazione degli oggetti';
    }
}

//Funzione per ottenere l'immagine in Base64
async function getBase64Image(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result.split(',')[1]);
        };
        reader.readAsDataURL(file);
    });
}

//Funzione per generare una descrizione tramite Cohere
async function generateDescription(objectRecognized) {
    let responseContainer = document.querySelector("#output")
    try {
        //richiesta all'API di Cohere
        const response = await fetch("https://api.cohere.ai/v1/chat", {
            method: "POST",
            headers: {
                Authorization: "Bearer FfgibsqJTi4lNUGeIHBlyr5ZVbg8OeW9S872zj7k", // Sostituisci con la tua chiave API reale
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "command",
                message: `describe the smell of these things: ${objectRecognized}`,
                max_tokens: 100,
            }),
        });

        const data = await response.json();
        return data.text; // Modifica in base alla struttura della risposta
    } catch (error) {
        console.error('Errore durante la richiesta Cohere AI:', error);
        return 'Errore nella generazione della descrizione';
    }
}


//inizializza la fotocamera quando la pagina di carica
window.onload = startCamera;

console.log()