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
    if (staticResponse1.textContent === "Sushino domani?") {
      staticResponse1.textContent = "🙊🙊🙊🙊🙊🙊🙊🙊";
    } else {
      staticResponse1.textContent = "Sushino domani?";
    }
  });

  staticResponse2.addEventListener("click", function () {
    if (staticResponse2.textContent === "come è andata con Riccardo?") {
      staticResponse2.textContent = "🙊🙊🙊🙊🙊🙊🙊🙊🙊🙊🙊🙊🙊";
    } else {
      staticResponse2.textContent = "come è andata con Riccardo?";
    }
  });


});
