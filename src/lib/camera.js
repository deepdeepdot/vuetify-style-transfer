// Rewritten based on:
// https://mdn-samples.mozilla.org/s/webrtc-capturestill/capture.js

export default class CameraCapture {
    constructor(video) {
        this.video = video;
        this.videoStream = null;
    }

    activate() {
        let setupStream = (stream) => {
            this.videoStream = stream;
            this.video.srcObject = stream;
            this.video.play();
        };
        if (!this.videoStream) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                .then(setupStream)
                .catch(function (err) {
                    console.log("An error occurred: " + err);
                });
        }
    }

    deactivate() {
        if (this.videoStream) {
            this.videoStream.getTracks()[0].stop();
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

function capture(video, image) {
    if (!video || !image) {
        throw new Error('Camera capture(video, image) missing args');
    }
    let canvas = document.createElement('canvas');
    canvas.width = video.width;
    canvas.height = video.height;
    let ctx = canvas.getContext('2d');

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    let imageDataURL = canvas.toDataURL('image/png');
    image.crossOrigin = "anonymous";
    image.src = imageDataURL;
}
