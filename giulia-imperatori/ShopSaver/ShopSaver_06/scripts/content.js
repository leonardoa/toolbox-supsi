// Creates the event when a button is clicked
document.addEventListener("click", async (event) => {
  // Check if the clicked element is a button, input, span, icon, a, svg or img
  if (
    event.target.tagName === "BUTTON" ||
    event.target.tagName === "INPUT" ||
    event.target.tagName === "SPAN" ||
    event.target.tagName === "ICON" ||
    event.target.tagName === "A" ||
    event.target.tagName === "SVG" ||
    event.target.tagName === "IMG"  
  ) {
    // Get the active tab
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Execute the doTheMagic function on the active tab
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: doTheMagic,
    });
  }
});

// Function to make the elements escape
function doTheMagic() {
  // Get all buttons, input elements, spans, icons, a, svg and imgs on the page
  let elements = document.querySelectorAll("button, input, span, icon, a, svg, img");

  // Add event listener to each element
  elements.forEach((element) => {
    // Add click event listener to show an alert
    element.addEventListener("click", () => {
      alert("");
    });

    // Add mouseover event listener to move the element randomly
    element.addEventListener("mouseover", () => {
      console.log("Element hovered");
      moveElementRandomly(element);
    });
  });

  // Function to move the element randomly
  function moveElementRandomly(element) {
    // Set the position of the element to a random location
    element.style.position = "absolute";
    element.style.left = Math.floor(Math.random() * window.innerWidth) + "px";
    element.style.top = Math.floor(Math.random() * window.innerHeight) + "px";
  }
}
