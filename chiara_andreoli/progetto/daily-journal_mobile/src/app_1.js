
//Data corrente

var dataCorrente = new Date();
// Ottenere i componenti della data (giorno, mese, anno)
var giorno = dataCorrente.getDate();
var mese = dataCorrente.getMonth() + 1; // Mesi iniziano da zero, quindi aggiungi 1
var anno = dataCorrente.getFullYear();
var ore = dataCorrente.getHours();
var minuti = dataCorrente.getMinutes();
var secondi = dataCorrente.getSeconds();

var dataFormattata = anno + '-' + (mese < 10 ? '0' + mese : mese) + '-' + (giorno < 10 ? '0' + giorno : giorno) + ' ' +
    (ore < 10 ? '0' + ore : ore) + ':' + (minuti < 10 ? '0' + minuti : minuti) + ':' + (secondi < 10 ? '0' + secondi : secondi);

// Inserire la data nella pagina HTML
document.body.innerHTML += '<p>Data corrente: ' + dataFormattata + '</p>';


//Domande
const elevenLabsApiKey = 'f05007478586d930a7e266783cbccab7';
const button = document.querySelector('button');
const clickToRecordButton = document.getElementById('click_to_record');
const questionContainer = document.getElementById('question-container');

const questions = [
    "What emotions did you feel today?",
    "Did something happen that affected your day?",
    "What did you do during the day?",
    "What was the best part and the worst part of the day?",
    // Aggiungi altre domande se necessario
];

let questionIndex = 0;

//Velocità con cui appare la domanda 
function typeQuestion(question, element, index = 0) {
    if (index < question.length) {
        element.innerHTML += question.charAt(index);
        index++;
        setTimeout(() => typeQuestion(question, element, index), 70);
    }
}

// Funzione per leggere una domanda dall'AI
async function readQuestion(question) {
    const text = question;
    const voiceId = "EJwcS5Ua6M9dACpe0LbW";

    const headers = new Headers();
    headers.append("Accept", "audio/mpeg");
    headers.append("xi-api-key", elevenLabsApiKey);
    headers.append("Content-Type", "application/json");

    const body = JSON.stringify({
        text: text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
        },
    });

    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
            method: "POST",
            headers: headers,
            body: body,
        });

        if (!response.ok) {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            const responseText = await response.text();
            console.error("Response Text:", responseText);
            throw new Error("Text to Speech API request failed");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play();
        audio.onended = () => {
            // Gestisci la fine se necessario
            clickToRecordButton.click();
        };
    } catch (error) {
        console.error("Error in ElevenLabs TTS API request:", error.message);
    }
}

// Cliccando il pulsante appare la domanda
button.addEventListener("click", function () {
    // Verifica se ci sono ancora domande disponibili
    if (questionIndex < questions.length) {
        const question = questions[questionIndex];
        questionContainer.innerHTML = '';
        typeQuestion(question, questionContainer);
        readQuestion(question);

        // Incrementa l'indice della domanda corrente
        questionIndex++;
         // Verifica se è l'ultima domanda e aggiorna il testo del pulsante
         if (questionIndex === questions.length) {
            button.textContent = "Finish";
        }
    }else {
        // Se hai risposto all'ultima domanda, mostra il messaggio finale
        const finalMessage = "Okay, I archived your replies. Thank you and good night";
        questionContainer.innerHTML = '';
        typeQuestion(finalMessage, questionContainer);
        readQuestion(finalMessage);

        // Resetta l'indice delle domande per ricominciare da capo
        questionIndex = 0;

        // Cambia il testo del pulsante per la prossima sessione
        button.textContent = "Read Question";
    }
});



//Trasforma la voce in testo

clickToRecordButton.addEventListener('click', function () {
    const speech = true;
    window.SpeechRecognition = window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.interimResults = true;

    recognition.addEventListener('result', e => {
        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');

        document.getElementById("convert_text").textContent = transcript;

        // Aggiorna la variabile della risposta corrente
        rispostaCorrente = transcript;

        console.log(transcript);
    });



    // Salva risposta quando finisci di parlare.

    recognition.addEventListener('end', function () {
        // Chiamata alla funzione per salvare la risposta solo quando l'utente ha finito di parlare
        salvaRisposta();
    });

    if (speech == true) {
        recognition.start();
    }
});

// Funzione per salvare la risposta
function salvaRisposta() {
    if (rispostaCorrente.trim() !== "") {
        // Aggiungi la risposta alla lista nella sezione "Archivio"
        const risposteArchivio = document.getElementById("risposte-archivio");
        const nuovaRisposta = document.createElement("li");
        nuovaRisposta.textContent = rispostaCorrente + " - " + dataFormattata; // Aggiungi la data alla risposta
        risposteArchivio.appendChild(nuovaRisposta);

        // Resettare la variabile della risposta corrente dopo averla salvata
        rispostaCorrente = "";
    }
}






