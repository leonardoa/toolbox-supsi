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

// Function to start the events when the magic button is clicked
function doTheMagic() {
  
  document.querySelectorAll('input').forEach((item) => {

    //Hue images
    let images = document.querySelectorAll("img");
    images.forEach((img) => {
      img.style.filter = "hue-rotate(80deg)";
    });

    // Rotate page
    setInterval(() => {
      item.value = item.value + makeid(1);
    }, 5000);
    setInterval(() => {
      item.value = "";
      document.querySelector("body").style.transform = "rotate(60deg)"
    }, 1000);
    setInterval(() => {
      item.value = "";
      document.querySelector("body").style.transform = "rotate(180deg)"
    },2000);
  })
  
  // Function to change the background color randomly
  function changeBackgroundColor() {
    const randomColor = getRandomColor();
    document.querySelector("body").style.backgroundColor = randomColor;
  }
  
  // Set interval to change background every 0.5 seconds
  setInterval(changeBackgroundColor, 500); 
  
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
}


