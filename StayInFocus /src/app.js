let label = document.getElementById("label");
let frase = document.getElementById("frase");
let randomVideo = document.getElementById("randomVideo");
let isVideoPlaying = false;
let videoClearTimeout;
let shouldHideVideo = false;
let audioPlayed = false;

// Video
const videoNames = ['video1', 'video2', 'video3'];
let currentVideoIndex = 0;

// variabile per capire se il video è in pausa
let isVideoFunctionPaused = false;

function playRandomVideo() {
  // Seleziona un video dalla cartella
  const randomIndex = Math.floor(Math.random() * videoNames.length);
  randomVideo.src = `videos/${videoNames[randomIndex]}.mp4`;

  randomVideo.controls = false;

  // fa partire quando il video è pronto
  randomVideo.addEventListener('canplay', function () {
    randomVideo.play();
    isVideoPlaying = true;
  }, { once: true });

  // capisce quando il video finisce e lo nasconde
  randomVideo.addEventListener('ended', function () {
    isVideoPlaying = false;

    // nasconde il video
    hideVideo();
  });
}

function hideVideo() {
  videoClearTimeout = setTimeout(function () {
    randomVideo.src = "";
    randomVideo.pause();
  }, 1000);
}

function drawResult(result) {
  // toglie il timeout se c'era
  clearTimeout(videoClearTimeout);

  // controllo se la funzione è in pausa
  if (isVideoFunctionPaused) {
    return;
  }

  if (result === "attento") {
    label.innerHTML = "In focus";
  } else if (result === "annoiato") {
    label.innerHTML = "Distracted";
  } else {
    label.innerHTML = result;
  }

  if (result == "attento") {
    frase.innerHTML = "Fa caldo, sconsigliatissima.";
    // Set video size to full screen
    randomVideo.style.width = "100%";
    randomVideo.style.height = "100%";
    // Play a random video when "annoiato" is detected
    playRandomVideo();
  } else if (result == "via") {
    if (!audioPlayed) {
      // Add the "back.mp3" when "via" is detected
      const audio = new Audio("audio/back.mp3");
      audio.play();
      audioPlayed = true; // Set the flag to true to indicate that the audio has been played
    }
    frase.innerHTML = "ma sei matto? Toglila";
  } else {
    frase.innerHTML = "perfett*.";
    // Reset the audioPlayed flag when the condition is no longer true
    audioPlayed = false;
  }

  videoClearTimeout = setTimeout(function () {
    // Reset del video size
    randomVideo.style.width = "400px";
    randomVideo.style.height = "300px";

    randomVideo.src = `videos/${videoNames[currentVideoIndex]}.mp4`;
    randomVideo.play();
    isVideoPlaying = true;
  }, 1000);
}

// Funzione che mette in pausa il programma
function pauseVideoFunction(durationMinutes) {
  isVideoFunctionPaused = true;
  setTimeout(() => {
    isVideoFunctionPaused = false;
  }, durationMinutes * 60 * 1000); // Convert minutes to milliseconds
}


//parte del timer

class Timer {
  constructor(root) {
    root.innerHTML = Timer.getHTML();

    this.el = {
      minutes: root.querySelector(".timer__part--minutes"),
      seconds: root.querySelector(".timer__part--seconds"),
      control: root.querySelector(".timer__btn--control"),
      reset: root.querySelector(".timer__btn--reset")
    };

    this.interval = null;
    this.remainingSeconds = 0;

    this.el.control.addEventListener("click", () => {
      if (this.interval === null) {
        this.start();
      } else {
        this.stop();
      }
    });

    this.el.reset.addEventListener("click", () => {
      const inputMinutes = prompt("Enter number of minutes:");

      if (inputMinutes < 60) {
        this.stop();
        this.remainingSeconds = inputMinutes * 60;
        this.updateInterfaceTime();
        // Pause the video function for the specified duration
        pauseVideoFunction(inputMinutes);
      }
    });
  }

  updateInterfaceTime() {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;

    this.el.minutes.textContent = minutes.toString().padStart(2, "0");
    this.el.seconds.textContent = seconds.toString().padStart(2, "0");
  }

  updateInterfaceControls() {
    if (this.interval === null) {
      this.el.control.innerHTML = `<span class="material-icons">play_arrow</span>`;
      this.el.control.classList.add("timer__btn--start");
      this.el.control.classList.remove("timer__btn--stop");
    } else {
      this.el.control.innerHTML = `<span class="material-icons">pause</span>`;
      this.el.control.classList.add("timer__btn--stop");
      this.el.control.classList.remove("timer__btn--start");
    }
  }

  start() {
    if (this.remainingSeconds === 0) return;

    this.interval = setInterval(() => {
      this.remainingSeconds--;
      this.updateInterfaceTime();

      if (this.remainingSeconds === 0) {
        this.stop();
      }
    }, 1000);

    this.updateInterfaceControls();
  }

  stop() {
    clearInterval(this.interval);

    this.interval = null;

    this.updateInterfaceControls();
  }

  static getHTML() {
    return `
			<span class="timer__part timer__part--minutes">00</span>
			<span class="timer__part">:</span>
			<span class="timer__part timer__part--seconds">00</span>
			<button type="button" class="timer__btn timer__btn--control timer__btn--start">
				<span class="material-icons">play_arrow</span>
			</button>
			<button type="button" class="timer__btn timer__btn--reset">
				<span class="material-icons">timer</span>
			</button>
		`;
  }
}

new Timer(
	document.querySelector(".timer")
);