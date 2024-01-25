let classifier;
let imageModelURL = "https://teachablemachine.withgoogle.com/models/H9sIczn6W/";
let video_hidden;
let flippedVideo;
let _label = "";
let result = "";
let canvas_hidden;

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + "model.json");
}

function setup() {
  canvas_hidden = createCanvas(320, 240);
  canvas_hidden.hide();
  video_hidden = createCapture(VIDEO);
  video_hidden.size(320, 240);
  video_hidden.hide();

  flippedVideo = ml5.flipImage(video_hidden);
  classifyVideo();
}

function draw() {
  image(flippedVideo, 0, 0);
  result = _label;
  drawResult(result); // Chiamata a drawResult per gestire l'audio
}

function classifyVideo() {
  flippedVideo = ml5.flipImage(video_hidden);
  classifier.classify(flippedVideo, gotResult);
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  _label = results[0].label;
  classifyVideo(); // Richiama nuovamente la classificazione per continuare l'analisi
}
