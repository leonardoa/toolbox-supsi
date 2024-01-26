// Creates the event when a button is clicked to call the elements
document.addEventListener("click", async (event) => {
  // Get the active tab
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Execute the doTheMagic function on the active tab
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: doTheMagic,
  });
});

// Function to make the div elements move and fluctuate inside the page
function doTheMagic() {
  // Get all the div elements on the page
  let elementsToMove = document.querySelectorAll("div");

  // Add event listener to each element for mouseover
  elementsToMove.forEach((element) => {
    element.addEventListener("mouseover", () => {
      console.log("Element hovered");
      fluctuateElement(element);
      
      // Invert colors
      invertPageColors();
    });

  });

  // Function to move and fluctuate the element inside the page
  function fluctuateElement(element) {
    // Set position to absolute for random movement
    element.style.position = "absolute";

    // Add a smooth transition effect for random movement
    element.style.transition = "left 10s, top 10s";

    // Move the element randomly within the page boundaries
    moveElementRandomly(element);
  }

  // Function to move the element randomly within the page boundaries
  function moveElementRandomly(element) {
    // Calculate random left and top positions within the page boundaries
    const newLeft = Math.floor(Math.random() * (window.innerWidth - element.offsetWidth));
    const newTop = Math.floor(Math.random() * (window.innerHeight - element.offsetHeight));

    // Change direction when the mouse hovers
    const deltaX = newLeft - parseFloat(element.style.left || 0);
    const deltaY = newTop - parseFloat(element.style.top || 0);

    element.style.left = newLeft + "px";
    element.style.top = newTop + "px";

    // Change the rotation direction based on mouse hover
    element.style.transform = `rotate(${Math.atan2(deltaY, deltaX) * (180 / Math.PI)}deg)`;
  }

  // Function to invert colors of the entire page
  function invertPageColors() {
    document.body.style.filter = "invert(100%)";
  }
}
