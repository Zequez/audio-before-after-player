// Fetch files.csv and parse into {title, before, after} objects
(async () => {
  const $$ = (id) => document.getElementById(id);

  async function fetchFiles() {
    return await fetch("files.csv")
      .then((res) => res.text())
      .then((text) => {
        const lines = text.split("\n");
        return lines.map((line) => {
          const [title, before, after] = line.split(/\s*,\s*/);
          return { title, before, after };
        });
      });
  }

  const files = await fetchFiles();

  const $audioItem = document.getElementById("audio-list-item");
  const $audioList = document.getElementById("audio-list");
  function renderAudioFiles() {
    files.forEach((file, i) => {
      const $newAudioItem = $audioItem.content.cloneNode(true);
      $newAudioItemRoot = $newAudioItem.firstElementChild;
      $newAudioItem.querySelector(".audio-item-title").innerText = file.title;
      $newAudioItem.querySelector(".audio-item-play");
      console.log($newAudioItem);
      $newAudioItemRoot.addEventListener("click", () => {
        loadFile(i, true);
      });
      $audioList.appendChild($newAudioItem);
    });
  }
  renderAudioFiles();

  const $prevButton = $$("prev-button");
  const $playButton = $$("play-button");
  const $playIcon = $$("play-icon");
  const $pauseIcon = $$("pause-icon");
  const $nextButton = $$("next-button");
  const $timeCurrent = $$("time-current");
  const $timeTotal = $$("time-total");
  const $beforeAfterToggle = $$("before-after-toggle");

  $beforeAfterToggle.addEventListener("change", setCurrentPlayfile);
  $playButton.addEventListener("click", playPauseFile);

  let before = null;
  let after = null;
  let current = null;

  function loadFile(index, play) {
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
    setCurrentPlayfile();
    if (play) {
      current.play();
      setPlayIcon();
    }
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

    setTotalTime();
  }

  function setTotalTime() {
    current.addEventListener("loadedmetadata", () => {
      $timeTotal.innerText = formatDuration(current.duration);
    });
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

  setInterval(() => {
    if (current && !current.paused) {
      $timeCurrent.innerText = formatDuration(current.currentTime);
    }
  }, 100);

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

  loadFile(0);
})();
