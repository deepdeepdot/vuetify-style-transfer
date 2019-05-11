// Rewritten based on:
// https://mdn-samples.mozilla.org/s/webrtc-capturestill/capture.js

export default class CameraCapture {
    constructor(videoId) {
        this.videoId = videoId;
        this.videoStream = null;
    }

    activate() {
        let video = document.getElementById(this.videoId);

        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then( (stream) => {
                this.videoStream = stream;
                video.srcObject = stream;
                video.play();
            })
            .catch(function (err) {
                console.log("An error occurred: " + err);
            });
    }

    deactivate() {
        this.videoStream.getTracks()[0].stop();
    }

    setImageDestination(image) {
        this.imageDestination = image;
    }

    captureImageFromCamera() {
        let video = document.getElementById(this.videoId);
        capture(video, this.imageDestination);
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
    image.crossOrigin = "Anonymous";
    image.src = imageDataURL;
}
