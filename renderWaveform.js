function renderWaveform(audioObject) {
  let audioContext = new AudioContext();

  // load the audio file and decode it into a buffer
  let fileReader = new FileReader();
  fileReader.onload = function () {
    audioContext.decodeAudioData(fileReader.result, function (buffer) {
      // create an AnalyserNode to get frequency and time-domain data
      let analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;

      // connect the buffer to the analyser
      let audioBufferSource = audioContext.createBufferSource();
      audioBufferSource.buffer = buffer;
      audioBufferSource.connect(analyser);
      audioBufferSource.start(0);

      // render the waveform using a canvas element
      let canvasContext = $waveform.getContext("2d");
      let canvasWidth = $waveform.width;
      let canvasHeight = $waveform.height;
      let bufferLength = analyser.frequencyBinCount;
      let dataArray = new Uint8Array(bufferLength);
      let pixelSpacing = 1;
      let scale = canvasHeight / 2;

      canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
      canvasContext.beginPath();
      canvasContext.strokeStyle = "rgba(0, 0, 0, 0.5)";
      canvasContext.lineWidth = 1;

      function renderFrame() {
        // get the time-domain data and calculate the waveform
        analyser.getByteTimeDomainData(dataArray);

        for (let i = 0; i < canvasWidth; i++) {
          let sampleIndex = Math.floor((i * bufferLength) / canvasWidth);
          let sampleValue = dataArray[sampleIndex] / 128 - 1;
          let x = i * pixelSpacing;
          let y = (1 + sampleValue) * scale;

          if (i === 0) {
            canvasContext.moveTo(x, y);
          } else {
            canvasContext.lineTo(x, y);
          }
        }

        canvasContext.stroke();
      }

      // start rendering the waveform
      renderFrame();
    });
  };

  let xhr = new XMLHttpRequest();
  xhr.open("GET", audioObject.src, true);
  xhr.responseType = "blob";
  xhr.onload = function () {
    if (this.status === 200) {
      // create a blob URL from the blob response
      let blobUrl = URL.createObjectURL(this.response);
      fileReader.readAsArrayBuffer(blobUrl);
    }
  };
  xhr.send();
}
