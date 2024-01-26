const express = require('express');
const http = require('http');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const WebSocket = require('ws');
const cors = require('cors');


const app = express();
app.use(cors());


//serve per ricevere il segnale da arduino a visual studio. 
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const serialPort = new SerialPort('/dev/cu.usbmodem1401', { baudRate: 9600 });
const parser = serialPort.pipe(new Readline({ delimiter: '\r\n' }));

app.use(express.static('forse riesco'));

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  parser.on('data', (data) => {
    const message = data.trim();
    console.log(`Received from Arduino: ${message}`);
    ws.send(message); // Invia il messaggio WebSocket al client quando il pulsante sull'Arduino viene premuto
  });
});

server.listen(3000, () => {
  console.log('Server listening at http://localhost:3000');
});
