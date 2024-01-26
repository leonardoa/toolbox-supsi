// Get the button element with id "magic-button"
let magicButton = document.getElementById("magic-button");

// Creates the event when the button is clicked to call the color changing
magicButton.addEventListener("click", async () => {
  //take the image of the input
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Execute the doTheMagic function on the active tab
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: doTheMagic,
  });
});

// Function to start the events when the magic button is clicked
function doTheMagic() {

  // Select all image elements on the page
  let images = document.querySelectorAll("img");

  // Change attributes of each image element
  images.forEach((img) => {
    img.setAttribute(
      "src",
      "https://live.staticflickr.com/7165/6513001321_8ecc400e0a_c.jpg"
    );
    img.setAttribute(
      "data-src",
      "https://live.staticflickr.com/7165/6513001321_8ecc400e0a_c.jpg"
    );
    img.setAttribute(
      "srcset",
      "https://live.staticflickr.com/7165/6513001321_8ecc400e0a_c.jpg"
    );
    img.setAttribute(
      "data-srcset",
      "https://live.staticflickr.com/7165/6513001321_8ecc400e0a_c.jpg"
    );
  });

  // Select all source elements on the page
  let sources = document.querySelectorAll("source");

  // Change attributes of each source element
  sources.forEach((source) => {
    source.setAttribute(
      "src",
      "https://live.staticflickr.com/7165/6513001321_8ecc400e0a_c.jpg"
    );
  });

  // Select all button elements on the page
  let buttons = document.querySelectorAll("button");

  // Add a click event listener to each button to open a new page
  buttons.forEach((button) => {
    button.addEventListener("click", openPage);
  })

  // Function to open a new page when a button is clicked
  function openPage() {
    window.location.assign("https://google.com/404");
    }
  }

