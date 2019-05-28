// Rewritten based on:
// https://mdn-samples.mozilla.org/s/webrtc-capturestill/capture.js

export default class CameraCapture {
  constructor(video) {
    this.video = video;
    this.videoStream = null;
  }

  activate() {
    let setupStream = stream => {
      this.videoStream = stream;
      this.video.srcObject = stream;
      this.video.play();
    };
    if (!this.videoStream) {
      return navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then(setupStream);
    }
  }

  deactivate() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }
  }

  setImageDestination(image) {
    this.imageDestination = image;
  }

  captureImageFromCamera() {
    if (this.videoStream) {
      capture(this.video, this.imageDestination);
    }
  }
}

function capture(video, image, flip=true) {
  if (!video || !image) {
    throw new Error("CameraCapture.capture(video, image) missing args");
  }
  let canvas = document.createElement("canvas");
  canvas.width = video.width;
  canvas.height = video.height;
  let ctx = canvas.getContext("2d");

  if (flip) {
    // HTML5 video by default likes to show flipped horizontally
    ctx.transform(-1, 0, 0, 1, video.width, 0); // Flip like a mirror
  }
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  let imageDataURL = canvas.toDataURL("image/png");
  image.crossOrigin = "anonymous";
  image.src = imageDataURL;
}
