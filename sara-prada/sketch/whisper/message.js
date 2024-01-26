document.addEventListener("DOMContentLoaded", function () {
  const sendButton = document.getElementById("send-button");
  const response = document.getElementById("response");
  const userInput = document.getElementById("message-input");
  const staticResponse1 = document.getElementById("static-response1");
  const staticResponse2 = document.getElementById("static-response2");



  sendButton.addEventListener("click", function () {
    response.style.display = "block";
  });

  staticResponse1.addEventListener("click", function () {
    if (staticResponse1.textContent === "siete usciti?") {
      staticResponse1.textContent = "FTgsz527kajHH7";
    } else {
      staticResponse1.textContent = "siete usciti?";
    }
  });

  staticResponse2.addEventListener("click", function () {
    if (staticResponse2.textContent === "voglio i gossip!") {
      staticResponse2.textContent = "D4kvsf6tegah3";
    } else {
      staticResponse2.textContent = "voglio i gossip!";
    }
  });


});
