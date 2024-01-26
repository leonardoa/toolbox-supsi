// https://cohere.com
let chatHistory = [];
// var sVoiceId = "21m00Tcm4TlvDq8ikWAM"; //Rachel
const ELEVENLABS_API_KEY = "cTA9fHsuD9bm8YYlcpmIIVt1LRpluuErnnm0dOTi";

document
  .getElementById("send-button")
  .addEventListener("click", async function () {
    const userInput = document.getElementById("message-input").value;
    const responseContainer = document.getElementById("response");
    responseContainer.textContent = `...`;
    try {
      const response = await fetch("https://api.cohere.ai/v1/chat", {
        method: "POST",
        headers: {
          Authorization: "Bearer cTA9fHsuD9bm8YYlcpmIIVt1LRpluuErnnm0dOTi", // Replace with your actual API key
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "command",
          message: `write "${userInput}" with md5 encrypt into quotation mark only.`,
          temperature: 0.5,
          chat_history: chatHistory,
        }),
      });




      const data = await response.json();

      const extractedText = extractContentInSecondQuotes(data.text);


      // responseContainer.textContent = `${data.text}<br/>: RES: ${extractedText}`; // Modify based on how the response is structured
      responseContainer.innerHTML = `<div class='mess' data-original='${userInput}' data-content='${extractedText}'>${extractedText}</div>`; // Modify based on how the response is structured
      let messages = document.querySelectorAll('.mess');
      messages.forEach((item) => {
        item.addEventListener("touchstart", function (event) {
          if(item.innerHTML == event.target.dataset.original) {
            item.innerHTML = event.target.dataset.content;
          }
          else {
            item.innerHTML = event.target.dataset.original;
          }
        });
      });
      speak(data.text);

      chatHistory.push({
        role: "User",
        message: userInput,
      });

      chatHistory.push({
        role: "Chatbot",
        message: data.text,
      });

      document.getElementById("message-input").value = "";

      let history = document.getElementById("history");

      //append in history the history
      history.innerHTML = "";
      chatHistory.forEach((message) => {
        history.innerHTML += `<div class="message ${message.role}">${message.message}</div>`;
      });

      history.innerHTML += `<br/>`;
    } catch (error) {
      responseContainer.textContent = `Error: ${error}`;
    }


    async function speak(_text) {
      const status = document.getElementById("status");
      status.innerText = "Speak Pressed: ";

      const text = _text;
      const voiceId = "EXAVITQu4vr4xnSDxMaL";

      status.innerText += "\n" + text;

      const headers = new Headers();
      headers.append("Accept", "audio/mpeg");
      headers.append("xi-api-key", "bce606f32e88a5b60ae98edb68042c58");
      headers.append("Content-Type", "application/json");

      const body = JSON.stringify({
        text: text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      });

      fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
        method: "POST",
        headers: headers,
        body: body,
      })
        .then((response) => {
          if (response.ok) {
            status.innerText += "\nSpeech successfully generated!";
            return response.blob();
          } else {
            throw new Error("Error: " + response.statusText);
          }
        })
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const audio = new Audio(url);
          audio.play();
          audio.onended = () => {
            status.innerText += "\nAudio has finished playing!";
          };
        })
        .catch((error) => {
          console.error("Error:", error);
          status.innerText += "\nError: " + error.message;
        });
    }

    function extractContentInSecondQuotes(inputString) {
      const regex = /"[^"]*"/g; // Regular expression to match all text within double quotes
      const matches = inputString.match(regex); // Using match to find all quoted text

      if (matches && matches.length >= 2) {
        return matches[1].replace(/"/g, ''); // Extracted text within the second pair of quotes
      } else {
        return null; // Return null if there are not enough matches
      }
    }


  });
