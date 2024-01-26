const socket = new WebSocket('ws://localhost:3000/');
let isBlack = false;
let audio = new Audio("src/sound/campanello.mp3");
let video = document.getElementById('videoElement');
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

socket.addEventListener('message', async function (event) {
  const message = event.data.trim();

  if (message === 'Pulsante premuto!') {
    console.log('Pulsante premuto! Avvia il suono e la videocamera.');
    await playSound();
    await startCamera();
    toggleBackgroundColor();
  }
});

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    console.error('Errore durante l\'avvio della videocamera:', err);
  }
}

function toggleBackgroundColor() {
  const newColor = isBlack ? '#ffffff' : '#000000';
  document.body.style.backgroundColor = newColor;
  isBlack = !isBlack;
}

async function playSound() {
  try {
    await audio.play();
  } catch (err) {
    console.error('Errore durante la riproduzione del suono:', err);
  }
}

video.addEventListener('play', function () {
  const width = canvas.width;
  const height = canvas.height;

  function drawFrame() {
    if (video.paused || video.ended) {
      return;
    }
    ctx.drawImage(video, 0, 0, width, height);
    requestAnimationFrame(drawFrame);
  }
  drawFrame();
});
