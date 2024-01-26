// Creates the event when the ShopSaver button is clicked
document.querySelector("#magic-button").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Execute the popup function on the active tab
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: popup,
  });
});

// Function to display error popups
function popup() {
  alert("ERROR - Your credit card has had enough of it");
  alert("ERROR - Seriously you need help");
  alert("ERROR - Contact your therapist instead");

  // Add click event listeners to all buttons to trigger the openPage function
  let buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    button.addEventListener("click", openPage);
  })

  // Function to display error popups and redirect to another page when a button is clicked
  function openPage() {
    alert("ERROR - Nah you can't buy this");
    alert("ERROR - Buy a cat instead");
    alert("ERROR - You need to pay the rent");
    alert("ERROR - And taxes");
    alert("ERROR - You are so weak");
    alert("ERROR - get a social life");
    window.location.assign("https://www.succeedsocially.com/sociallife");
  }
}

// Get the button element with id "magic-button"
let magicButton = document.getElementById("magic-button");

// Creates the event listener when the button is clicked
magicButton.addEventListener("click", async () => {
  // Get the active tab
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
 
   // Execute the changeImages function on the active tab
   chrome.scripting.executeScript({
     target: { tabId: tab.id },
     function: changeImages,
   });
 });
 
// Function to change the page images and display a brush cursor on mouse movement
function changeImages() {
   // Select all image elements on the page 
   let images = document.querySelectorAll("img");

   // Change attributes of each image element
   images.forEach((img) => {
     img.setAttribute(
       "src",
       "https://gcdnb.pbrd.co/images/pSeLPJqBZltW.jpg?o=1"
     );
     img.setAttribute(
       "data-src",
       "https://gcdnb.pbrd.co/images/pSeLPJqBZltW.jpg?o=1"
     );
     img.setAttribute(
       "srcset",
       "https://gcdnb.pbrd.co/images/pSeLPJqBZltW.jpg?o=1"
     );
     img.setAttribute(
       "data-srcset",
       "https://gcdnb.pbrd.co/images/pSeLPJqBZltW.jpg?o=1"
     );
   });
 
   // Select all source elements on the page
   let sources = document.querySelectorAll("source");

   // Change attributes of each source element
   sources.forEach((source) => {
     source.setAttribute(
       "src",
       "https://gcdnb.pbrd.co/images/pSeLPJqBZltW.jpg?o=1"
     );
   });

   // Add a brush cursor on mouse movement
   document.addEventListener("mousemove", (event) => {
    const brushCursor = document.createElement("div");
    brushCursor.className = "brush-cursor";
    brushCursor.style.fontSize = "200px"

    // Create an img element and set its source
    const imgElement = document.createElement("img");
    imgElement.src = "https://gcdnb.pbrd.co/images/pSeLPJqBZltW.jpg?o=1";
    imgElement.style.width = "200px"; // Set the desired width

  // Append the img element to the brushCursor div
  brushCursor.appendChild(imgElement);

  document.body.appendChild(brushCursor);
    
    const mouseX = event.clientX -300;
    const mouseY = event.clientY -300;

    brushCursor.style.position = "absolute";
    brushCursor.style.left = `${mouseX}px`;
    brushCursor.style.top = `${mouseY}px`;
  });
 }