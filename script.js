// Fetch files.csv and parse into {title, before, after} objects
(async () => {
  const $$ = (id) => document.getElementById(id);

  async function fetchFiles() {
    return await fetch("files.csv")
      .then((res) => res.text())
      .then((text) => {
        const lines = text.split("\n");
        return lines
          .map((line) => {
            const [title, before, after] = line.split(/\s*,\s*/);
            return { title, before, after };
          })
          .filter(({ title, before, after }) => title && before && after);
      });
  }

  const files = await fetchFiles();

  const $audioItem = document.getElementById("audio-list-item");
  const $audioList = document.getElementById("audio-list");
  const $audioItems = [];
  function renderAudioFiles() {
    files.forEach((file, i) => {
      const $newAudioItem = $audioItem.content.cloneNode(true);
      $newAudioItemRoot = $newAudioItem.firstElementChild;
      $newAudioItem.querySelector(".audio-item-title").innerText = file.title;
      // $newAudioItem.querySelector(".audio-item-play");
      console.log($newAudioItem);
      $newAudioItemRoot.addEventListener("click", () => {
        loadFile(i, true);
      });
      $audioList.appendChild($newAudioItem);
      $audioItems.push($newAudioItemRoot);
    });
  }
  renderAudioFiles();

  const $waveform = $$("waveform");
  const $prevButton = $$("prev-button");
  const $playButton = $$("play-button");
  const $playIcon = $$("play-icon");
  const $pauseIcon = $$("pause-icon");
  const $nextButton = $$("next-button");
  const $timeCurrent = $$("time-current");
  const $timeTotal = $$("time-total");
  const $beforeAfterToggle = $$("before-after-toggle");
  const $scrubControl = $$("scrub-control");

  let before = null;
  let after = null;
  let current = null;
  let fileIndex = 0;

  bindEvents();
  loadFile(0);

  function bindEvents() {
    $beforeAfterToggle.addEventListener("change", setCurrentPlayfile);
    $playButton.addEventListener("click", playPauseFile);
    $nextButton.addEventListener("click", () => {
      loadFile(fileIndex + 1, true);
    });
    $prevButton.addEventListener("click", () => {
      console.log(current.currentTime);
      if (current.currentTime < 3) {
        loadFile(fileIndex - 1, true);
      } else {
        current.currentTime = 0;
      }
    });

    let lastTimeSet = 0;
    let scrubTimeout = null;
    setInterval(() => {
      if (current && lastTimeSet !== current.currentTime) {
        lastTimeSet = current.currentTime;
        $timeCurrent.innerText = formatDuration(current.currentTime);
        if (!scrubTimeout) {
          if (current.duration) {
            $scrubControl.value = current.currentTime / current.duration;
          } else {
            $scrubControl.value = 0;
          }
        }
      }
    }, 100);

    // Add input event listener to $scrubControl
    // Update the audio currentTime
    // And pause the audio while scrubbing using a 50ms timeout
    // to prevent the audio from playing while scrubbing
    $scrubControl.addEventListener("input", (e) => {
      const scrubTime = parseFloat(e.target.value) * current.duration;
      current.currentTime = scrubTime;
      if (!current.paused || scrubTimeout) {
        if (scrubTimeout) clearTimeout(scrubTimeout);
        if (!current.paused) current.pause();
        scrubTimeout = setTimeout(() => {
          current.play();
          scrubTimeout = null;
        }, 50);
      }
      // current.pause()
    });
  }

  function loadFile(index, play) {
    if (index < 0) {
      index = files.length - 1;
    } else if (index >= files.length) {
      index = 0;
    }

    if ($audioItems[fileIndex]) {
      $audioItems[fileIndex].classList.remove("playing");
    }
    $audioItems[index].classList.add("playing");

    fileIndex = index;
    if (before) {
      before.pause();
      before.src = "";
    }
    if (after) {
      after.pause();
      after.src = "";
    }
    before = new Audio(files[index].before);
    after = new Audio(files[index].after);
    $timeCurrent.innerText = "00:00";
    setCurrentPlayfile();
    if (play) {
      current.play();
      setPlayIcon();
    }
    // before.addEventListener()
  }

  function setCurrentPlayfile() {
    const prev = current;
    if ($beforeAfterToggle.checked) {
      current = after;
    } else {
      current = before;
    }

    if (prev && prev !== current) {
      current.currentTime = prev.currentTime;
      if (!prev.paused) {
        prev.pause();
        current.play();
      }
    }

    // renderWaveform(current);
    setTotalTime();
  }

  function setCurrentTime() {}

  function setTotalTime() {
    if (current.duration) {
      $timeTotal.innerText = formatDuration(current.duration);
    } else {
      $timeTotal.innerText = "--:--";
      // $timeCurrent.innerText = "--:--";
      current.addEventListener("loadedmetadata", () => {
        $timeTotal.innerText = formatDuration(current.duration);
        // $timeCurrent.innerText = formatDuration(current.currentTime);
      });
    }
  }

  function playPauseFile(forcePlay) {
    if (current.paused) {
      current.play();
    } else {
      current.pause();
    }
    setPlayIcon();
  }

  function setPlayIcon() {
    if (current.paused) {
      $playIcon.style.display = "block";
      $pauseIcon.style.display = "none";
    } else {
      $playIcon.style.display = "none";
      $pauseIcon.style.display = "block";
    }
  }

  function formatDuration(duration) {
    let minutes = Math.floor(duration / 60);
    let seconds = Math.floor(duration % 60);
    let formattedDuration =
      (minutes < 10 ? "0" : "") +
      minutes +
      ":" +
      (seconds < 10 ? "0" : "") +
      seconds;
    return formattedDuration;
  }
})();
