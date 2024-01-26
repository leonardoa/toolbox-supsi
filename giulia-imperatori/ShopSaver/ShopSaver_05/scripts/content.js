// Get the button element with id "add-button"
let addButton = document.getElementById("add-button");

// Event listener for the button click to add images
addButton.addEventListener("click", async () => {
  // Get the active tab
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Execute the addImages function on the active tab
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: addImages,
  });
});

// Function to add images to the page with randomized positions and rotations
function addImages() {
  let winWidth = window.innerWidth;
  let winHeight = document.body.offsetHeight;
  
  // Array of image URLs
  let images = [
    "https://gcdnb.pbrd.co/images/C0m2EjujvAlG.png?o=1",
    "https://gcdnb.pbrd.co/images/KnqsNz3v5IO4.png?o=1",
    "https://gcdnb.pbrd.co/images/gBms0P5uPXdo.png?o=1",
    "https://gcdnb.pbrd.co/images/N5AbW2McMeoU.webp?o=1",
    "https://gcdnb.pbrd.co/images/5V6FzMLcarm0.png?o=1",
    "https://gcdnb.pbrd.co/images/AHscddF6A6Ps.png?o=1",
    "https://gcdnb.pbrd.co/images/t0ouRcT6Dg45.png?o=1",
    "https://gcdnb.pbrd.co/images/ftdmzpewnt5i.png?o=1",
    "https://gcdnb.pbrd.co/images/fkYYZp8q5k8L.png?o=1",
    "https://gcdnb.pbrd.co/images/5JPlACJ2d1dB.png?o=1",
    "https://gcdnb.pbrd.co/images/NLRvpL611rD5.png?o=1",
    "https://gcdnb.pbrd.co/images/nD9xiH7irqJY.png?o=1",
    "https://gcdnb.pbrd.co/images/Ttkbg7zqsgYn.png?o=1",
    "https://gcdnb.pbrd.co/images/6Z4rfHGnEU3w.png?o=1",
    "https://gcdnb.pbrd.co/images/w2k4o22R5Csi.png?o=1",
    "https://gcdnb.pbrd.co/images/7SkSf6b4ObRB.png?o=1",

  ];

  // Loop to add images
  let i = 0;
  for (i = 0; i < 1000; i++) {
    setTimeout(() => {
      // Generate random positions
      randomTop = getRandomNumber(0, winHeight);
      randomLeft = getRandomNumber(0, winWidth);

      //Create image element
      var img = document.createElement("img");
      // Set image styles
      img.style.position = "absolute";
      img.style.zIndex = 10 + i;
      img.style.top = `${randomTop}px`;
      img.style.left = `${randomLeft}px`;
      img.style.transform = `rotate(${Math.floor(Math.random() * 360)}deg)`;
      img.style.width = `300px`;
      img.style.height = `auto`;
      
      // Set image source randomly from the array
      img.src = images[Math.floor(Math.random() * images.length)];

      // Add click event listener to hide the image on click
      img.addEventListener("click", ()=> {
        img.style.display = "none";
      });
      document.querySelector('body').appendChild(img);
    }, 100 * i);
  }

  // Function to get a random number within a range
  function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }
}
