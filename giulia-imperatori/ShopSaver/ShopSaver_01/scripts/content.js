// Event listener for the DOMContentLoaded event
document.addEventListener("DOMContentLoaded", function () {
  // Get the button element with id "magic-button"
  let magicButton = document.getElementById("magic-button");
  
  // Create an event listener for the button click to trigger the ShopSaver effects
  magicButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Execute the doTheMagic function on the active tab
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: doTheMagic,
    });
  });
});

// Function to start the events when the magic button is clicked
function doTheMagic() {

  // Random string of text with a specified length
  function makeid(length) {
    let result = '';
    const characters = 'la';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  // Call all the input elements and write random characters
  document.querySelectorAll('input').forEach((input) => {
    
    setInterval(() => {
      input.value = input.value + makeid(1);
    }, 100);
  })

  // Cursor brush with clowns on mouse movement
  document.addEventListener("mousemove", (event) => {
  
    // Create a brush cursor element
    const brushCursor = document.createElement("div");
    brushCursor.className = "brush-cursor";
    brushCursor.style.fontSize = "200px"
    brushCursor.innerHTML = "<span '>&#129313</span>";
    
    // Append the brush cursor to the body
    document.body.appendChild(brushCursor);
    
    // Calculate cursor position based on mouse coordinates
    const mouseX = event.clientX -100;
    const mouseY = event.clientY -100;

    // Set brush cursor position
    brushCursor.style.position = "absolute";
    brushCursor.style.left = `${mouseX}px`;
    brushCursor.style.top = `${mouseY}px`;

  });

      // Change the source of images to a circus tent image
      let images = document.querySelectorAll("img");
      images.forEach((img) => {
        img.src = "https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA0L2pvYjk2OS0xMy1wLnBuZw.png"
       });
  }


