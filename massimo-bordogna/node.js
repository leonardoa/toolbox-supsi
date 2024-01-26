
var robot = require("robotjs");
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 85;

// resetting html pages's names
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/sent", (req, res) => {
  res.sendFile(__dirname + "/sent.html");
});

app.get("/draft", (req, res) => {
  res.sendFile(__dirname + "/draft.html");
});

app.get("/spam", (req, res) => {
  res.sendFile(__dirname + "/spam.html");
});

app.get("/bin", (req, res) => {
  res.sendFile(__dirname + "/bin.html");
});

app.get("/inbox", (req, res) => {
  res.sendFile(__dirname + "/inbox.html");
});


// interaction with computer system depending on the message received
io.on("connection", (socket) => {
  socket.on("message", (msg) => {
    console.log(msg);
    io.emit("message", msg);


    if (msg == "luminosityminus") {
      robot.keyTap("lights_mon_down");
    }

    else if (msg == "mute") {
      robot.keyTap("audio_mute");
    }

    else if (msg == "luminosityplus") {
      robot.keyTap("lights_mon_up");
    }

    else if (msg == "circle") {
      robot.setMouseDelay(10);
      const screenSize = robot.getScreenSize();
      const height = screenSize.height;
      const width = screenSize.width;
      let elapsedTime = 0;
      
      function moveMouseInCircle() {
        const centerX = Math.floor(width / 2); // Center X coordinate
        const centerY = Math.floor(height / 2); // Center Y coordinate
        const radius = 150; // Radius of the circle
        const speed = 5; // Speed of the mouse movement (adjust as needed)
      
        const angle = (elapsedTime / 1000) * speed; // Angle increases over time
        const x = centerX + Math.floor(radius * Math.cos(angle));
        const y = centerY + Math.floor(radius * Math.sin(angle));
      
        robot.moveMouse(x, y);
      
        if (elapsedTime < 15000) { // Run for 30 seconds (30000 milliseconds)
          elapsedTime += 50; // Increase elapsed time by 50 milliseconds for each movement
          setTimeout(moveMouseInCircle, 50); // Call the function again after 50 milliseconds
        }
      }
      
      // Call the function to start moving the mouse in a circle
      moveMouseInCircle();  
    }

    else if (msg == "circlelum") {
    
    robot.setMouseDelay(10);

    const screenSize = robot.getScreenSize();
    const height = screenSize.height;
    const width = screenSize.width;
    let elapsedTime = 0;
    
    // Function to move the mouse casually around the screen
    function moveMouseCasually() {

      if (elapsedTime < 5000) { // Run for 10 seconds (10000 milliseconds)
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);
        robot.moveMouse(x, y);
    
        elapsedTime += 100; // Increase elapsed time by 200 milliseconds for each movement

        const number1OfPresses = Math.floor(Math.random() * 7) + 1; // Random number between 1 and 5

        for (let i = 0; i < number1OfPresses; i++) {
          // Perform the key tap
          robot.keyTap("lights_mon_down");
          elapsedTime += 100;
          // Introduce a delay between key presses if needed
          // For example, wait for 500 milliseconds between key presses
          // Adjust the delay based on your requirements
          robot.setKeyboardDelay(500);
        }
        const x1 = Math.floor(Math.random() * width);
        const y1 = Math.floor(Math.random() * height);
        robot.moveMouse(x1, y1);
        elapsedTime += 100; // Increase elapsed time by 200 milliseconds for each movement
      
        const number2OfPresses = Math.floor(Math.random() * 5) + 1;
        
        for (let i = 0; i < number2OfPresses; i++) {
          // Perform the key tap
          robot.keyTap("lights_mon_up");
          elapsedTime += 100;
          // Introduce a delay between key presses if needed
          // For example, wait for 500 milliseconds between key presses
          // Adjust the delay based on your requirements
          robot.setKeyboardDelay(500);
        }
        const x2 = Math.floor(Math.random() * width);
        const y2 = Math.floor(Math.random() * height);
        robot.moveMouse(x2, y2);
        elapsedTime += 100;
      
        setTimeout(moveMouseCasually, 100); // Call the function again after 200 milliseconds
      }
    }
    
    // Start moving the mouse casually
    moveMouseCasually();
    


  }});
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});


// node node.js